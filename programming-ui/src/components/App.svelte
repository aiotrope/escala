<script>
  import { onDestroy, onMount } from 'svelte';

  import {
    userUuid,
    assignments,
    submissions,
    userOnDb,
    gradeTally,
    assignmentIndex,
    answers,
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

  let answerCount = 0;

  $: answerAdded = answerCount;

  onMount(async () => {
    let fetchInterval = setInterval(async () => {
      const allAssignments = await assignmentService.fetchAllAssignments();

      const allAnswers = await assignmentService.findAllAnswers();

      const userSubmissions = await assignmentService.fetchAllUserSubmission(
        $userUuid
      );

      const userSavedOnDb = await assignmentService.fetchCurrentUserSavedOnDb(
        $userUuid
      );

      userOnDb.set(userSavedOnDb);

      assignments.set(allAssignments);

      answers.set(allAnswers);

      if (allAnswers.length > 0 && allAnswers !== undefined) {
        $userUuid = allAnswers[0]?.user_uuid;

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

        const processedSubmissions = allAnswers.filter(
          (sub) => sub.status === 'processed' && sub.user_uuid === $userUuid
        );

        const assignmentId = processedSubmissions[0]?.programming_assignment_id;

        const userCurrentGrade = processedSubmissions[0].grader_feedback

        const evaluate =
          userCurrentGrade === 'passes test' ? assignmentId + 1 : assignmentId;

        const index = $assignments.map((i) => i.id).indexOf(evaluate);

        gradeTally.set(points);

        submissions.set(userGradedSubmissions);

        assignmentIndex.set(index);
      }
    }, 2000);

    return () => {
      clearInterval(fetchInterval);
    };
  });

  

  const submitAnswer = async () => {
    const createSubmission = await assignmentService.createSubmission(
      $userUuid,
      code,
      currentAssignmentIndex
    );

    const userExists = await assignmentService.checkUserExists($userUuid);

    if (userExists?.exists) {
      answerCount = ++answerCount;
      userOnDb.update((currentData) => ({ ...currentData, ...userExists }));

      // userUuid.update(createSubmission?.user_uuid);

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

  const updateIndex = async () => {
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

  $: console.log(currentAssignmentIndex);
</script>

<div class="md:w-2/5">
  <div class="my-5">
    <p>
      There are {$assignments.length} Python problem sets needed to be answered.
    </p>
  </div>

  <h1 class="text-2xl mb-5">
    Problem # {$assignments[$assignmentIndex]?.assignment_order}: {$assignments[
      $assignmentIndex
    ]?.title}
  </h1>
  <section class="mt-2 mb-8">
    <p class="text-xl my-2">Problem Handout</p>
    <p class="text-base my-2 md:text-lg">
      {$assignments[$assignmentIndex]?.handout}
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

    {#if $submissions?.length}
      <div>
        {#each $submissions as data}
          <p class={`${data.correct ? 'text-green-500' : 'text-red-500'}`}>
            {data?.correct ? 'Correct' : 'Incorrect'} - {data?.grader_feedback}
          </p>
        {/each}
      </div>
    {:else}
      <p>
        There are {$assignments.length} Python problem sets needed to be answered.
      </p>
    {/if}
  </section>
  {currentAssignmentIndex}
</div>
