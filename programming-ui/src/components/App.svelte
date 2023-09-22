<script>
  import { onDestroy, onMount } from 'svelte';

  import {
    userUuid,
    assignments,
    submissions,
    userOnDb,
    gradeTally,
    assignmentIndex,
  } from '../stores/stores.js';

  import assignmentService from '../services/assignmentService.js';

  import Form from './Form.svelte';

  // let assignmentIndex = 0;

  let code;

  let currentUserOnDb;

  let currentSubmissions;

  let currentGradeTally;

  let isInCorrect = true;

  let currentUserUuid;

  let currentAssignmentIndex;

  onMount(async () => {
    const allAssignments = await assignmentService.fetchAllAssignments();

    assignments.set(allAssignments);
    let fetchInterval = setInterval(async () => {
      assignments.set(allAssignments);
    }, 2000);

    return () => {
      clearInterval(fetchInterval);
    };
  });

  onMount(async () => {
    const findAllAnswers = await assignmentService.findAllAnswers();

    if (findAllAnswers.length === 0 && !currentUserOnDb?.exists) {
      let user = crypto.randomUUID().toString();
      userUuid.set(user);
      // assignmentIndex.set(0);
    }
  });

  onMount(async () => {
    const findAllAnswers = await assignmentService.findAllAnswers();

    let user;

    let fetchInterval;

    if (findAllAnswers.length !== 0) {
      fetchInterval = setInterval(async () => {
        user = findAllAnswers[0].user_uuid;

        userUuid.set(user);

        const userSubmissions = await assignmentService.fetchAllUserSubmission(
          user
        );

        const userSavedOnDb = await assignmentService.fetchCurrentUserSavedOnDb(
          user
        );

        userOnDb.set(userSavedOnDb);

        const processedSubmissions = userSubmissions.filter(
          (sub) => sub.status === 'processed'
        );
 
        const assignmentId = processedSubmissions[0].programming_assignment_id;

        const userCurrentGrade = processedSubmissions[0].grader_feedback

        const evaluate = userCurrentGrade === 'passes test' ? assignmentId + 1 : assignmentId

        const index = $assignments.map((i) => i.id).indexOf(evaluate);

        assignmentIndex.set(index);

        const userGradedSubmissions = userSubmissions.filter(
          (json) =>
            json?.status === 'processed' && json?.grader_feedback !== null
        );

        const countSub1 = userSubmissions.filter(
          (sub) =>
            sub.programming_assignment_id === 1 &&
            sub.status === 'processed' &&
            sub.correct
        ).length;
        const countSub2 = userSubmissions.filter(
          (sub) =>
            sub.programming_assignment_id === 2 &&
            sub.status === 'processed' &&
            sub.correct
        ).length;
        const countSub3 = userSubmissions.filter(
          (sub) =>
            sub.programming_assignment_id === 3 &&
            sub.status === 'processed' &&
            sub.correct
        ).length;

        const sub1 = countSub1 > 0 ? 100 : 0;
        const sub2 = countSub2 > 0 ? 100 : 0;
        const sub3 = countSub3 > 0 ? 100 : 0;

        const points = sub1 + sub2 + sub3;

        gradeTally.set(points);

        submissions.set(userGradedSubmissions);
      }, 1000);

      return () => {
        clearInterval(fetchInterval);
      };
    }
  });

  const submitAnswer = async () => {
    const createSubmission = await assignmentService.createSubmission(
      $userUuid,
      code,
      currentAssignmentIndex
    );

    const userExists = await assignmentService.checkUserExists($userUuid);

    if (userExists?.exists) {
      userOnDb.update((currentData) => ({ ...currentData, ...userExists }));

      const userLatestSubmission = await assignmentService.findSubmissionById(
        createSubmission?.id
      );

      isInCorrect = createSubmission?.result === 'passes test' ? false : true;

      const foundCodeAndAssignmentDuplicate = currentSubmissions.find(
        (sub) =>
          sub?.id !== userLatestSubmission?.id &&
          sub.code === userLatestSubmission?.code &&
          sub?.programming_assignment_id ===
            userLatestSubmission?.programming_assignment_id
      );

      if (!foundCodeAndAssignmentDuplicate) {
        await assignmentService.updateSubmission(createSubmission);

        code =
          createSubmission?.result === 'passes test'
            ? ''
            : userLatestSubmission?.code;
      } else {
        alert('Identical code on a given assignment. Submission not graded!');
      }
    }
  };

  const updateIndex = () => {
    assignmentIndex.update((currentValue) => currentValue + 1);
    isInCorrect = true;
    $assignmentIndex %= $assignments.length;
  };

  let unsubscribeUserOnDb = userOnDb.subscribe((currentValue) => {
    currentUserOnDb = currentValue;
  });

  let unsubscribeSubmission = submissions.subscribe((currentValue) => {
    currentSubmissions = currentValue;
  });

  let unsubscribeGradeTally = gradeTally.subscribe((currentValue) => {
    currentGradeTally = currentValue;
  });

  let unsubscribeUserUuid = userUuid.subscribe((currentValue) => {
    currentUserUuid = currentValue;
  });

  let unsubscribeAssignmentIndex = assignmentIndex.subscribe((currentValue) => {
    currentAssignmentIndex = currentValue;
  });

  onDestroy(unsubscribeUserOnDb);

  onDestroy(unsubscribeSubmission);

  onDestroy(unsubscribeGradeTally);

  onDestroy(unsubscribeUserUuid);

  onDestroy(unsubscribeAssignmentIndex);
</script>

<div class="md:w-2/5">
  <div class="my-5">
    <p>
      There are {$assignments.length} Python problem sets needed to be answered.
    </p>
  </div>

  <h1 class="text-2xl mb-5">
    Problem # {$assignments[currentAssignmentIndex]?.assignment_order}: {$assignments[
      currentAssignmentIndex
    ]?.title}
  </h1>
  <section class="mt-2 mb-8">
    <p class="text-xl my-2">Problem Handout</p>
    <p class="text-base my-2 md:text-lg">
      {$assignments[currentAssignmentIndex]?.handout}
    </p>
  </section>

  <section>
    <Form
      bind:value={code}
      {submitAnswer}
      {updateIndex}
      {isInCorrect}
      {currentAssignmentIndex}
    />
  </section>

  <section>
    <h3>User submissions</h3>
    <p>Current User exists: {currentUserOnDb?.exists}</p>

    {#if currentSubmissions?.length}
      <div>
        {#each currentSubmissions as data}
          <p class={`${data.correct ? 'text-green-500' : 'text-red-500'}`}>
            {data?.correct ? 'Correct' : 'Incorrect'}
          </p>
        {/each}
      </div>
    {:else}
      <p>
        There are {$assignments.length} Python problem sets needed to be answered.
      </p>
    {/if}
  </section>
</div>
