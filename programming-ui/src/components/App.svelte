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

  import Handout from './Handout.svelte';
  import Form from './Form.svelte';
  import Loader from './Loader.svelte';

  let code;

  let currentUserOnDb;

  let currentGradeTally;

  let isInCorrect = true;

  let currentAssignmentIndex;

  let isLoading = true;

  onMount(async () => {
    await initialize();
  });

  const initialize = async () => {
    const timer = setTimeout(async () => {
      const allAssignments = await assignmentService.fetchAllAssignments();

      const setUserId = await assignmentService.getUser();

      const allAnswers = await assignmentService.findAllAnswers();

      const userSubmissions = await assignmentService.fetchAllUserSubmission(
        setUserId
      );

      const userSavedOnDb = await assignmentService.checkUserExists(setUserId);

      assignments.set(allAssignments);

      userUuid.set(setUserId);

      answers.set(allAnswers);

      userOnDb.set(userSavedOnDb);

      submissions.set(userSubmissions);

      console.clear();

      isLoading = false;

      if (
        $userOnDb?.exists &&
        $submissions.length > 0 &&
        $userUuid !== null &&
        $submissions !== null
      ) {
        const processedSubmissions = $submissions?.filter(
          (sub) => sub?.status === 'processed' && sub?.grader_feedback !== null
        );

        const userCurrentCode = processedSubmissions[0]?.code;

        code = userCurrentCode;

        const assignmentId = processedSubmissions[0]?.programming_assignment_id;

        const evaluate = processedSubmissions[0]?.grader_feedback;

        isInCorrect = evaluate === 'passes test' ? false : true;

        const index = $assignments.map((i) => i.id).indexOf(assignmentId);

        assignmentIndex.set(index);

        await setPoints();

        isLoading = false;
      }
    }, 30000);
    return () => clearTimeout(timer);
  };

  const setPoints = async () => {
    const userSubmissions = await assignmentService.fetchAllUserSubmission(
      $userUuid
    );

    const userGradedSubmissions = userSubmissions.filter(
      (json) => json?.status === 'processed' && json?.grader_feedback !== null
    );

    const countSub1 = userSubmissions?.filter(
      (sub) =>
        sub?.programming_assignment_id === 1 &&
        sub?.status === 'processed' &&
        sub?.correct
    ).length;
    const countSub2 = userSubmissions?.filter(
      (sub) =>
        sub?.programming_assignment_id === 2 &&
        sub?.status === 'processed' &&
        sub?.correct
    ).length;
    const countSub3 = userSubmissions?.filter(
      (sub) =>
        sub?.programming_assignment_id === 3 &&
        sub?.status === 'processed' &&
        sub?.correct
    ).length;

    const sub1 = countSub1 > 0 ? 100 : 0;
    const sub2 = countSub2 > 0 ? 100 : 0;
    const sub3 = countSub3 > 0 ? 100 : 0;

    const points = sub1 + sub2 + sub3;

    gradeTally.set(points);

    $submissions = userGradedSubmissions;
  };

  const submitAnswer = async () => {
    const createSubmission = await assignmentService.createSubmission(
      $userUuid,
      code,
      currentAssignmentIndex
    );

    const userExists = await assignmentService.checkUserExists($userUuid);

    if (userExists?.exists) {
      userOnDb.update((currentData) => ({ ...currentData, ...userExists }));

      $userUuid = createSubmission?.user_uuid;

      const userLatestSubmission = await assignmentService.findSubmissionById(
        createSubmission?.id
      );

      isInCorrect = createSubmission?.result === 'passes test' ? false : true;

      const foundCodeAndAssignmentDuplicate = $submissions.find(
        (sub) =>
          sub?.id !== userLatestSubmission?.id &&
          sub.code === userLatestSubmission?.code &&
          sub?.programming_assignment_id ===
            userLatestSubmission?.programming_assignment_id
      );

      if (!foundCodeAndAssignmentDuplicate) {
        await assignmentService.updateSubmission(createSubmission);

        const updatedUserSubmissionList =
          await assignmentService.fetchAllUserSubmission($userUuid);

        $submissions = [...updatedUserSubmissionList];

        const updatedAnswerList = await assignmentService.findAllAnswers();

        $answers = [...updatedAnswerList];

        await setPoints();

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

  const unsubscribeUserOnDb = userOnDb.subscribe((currentValue) => {
    currentUserOnDb = currentValue;
  });

  submissions.subscribe((currentValue) => {
    localStorage.setItem('submissions', JSON.stringify(currentValue));
  });

  const unsubscribeGradeTally = gradeTally.subscribe((currentValue) => {
    currentGradeTally = currentValue;
  });

  const unsubscribeAssignmentIndex = assignmentIndex.subscribe(
    (currentValue) => {
      currentAssignmentIndex = currentValue;
    }
  );

  userUuid.subscribe((currentValue) => {
    localStorage.setItem('userUuid', JSON.stringify(currentValue));
  });

  assignments.subscribe((currentValue) => {
    localStorage.setItem('assignments', JSON.stringify(currentValue));
  });

  answers.subscribe((currentValue) => {
    localStorage.setItem('answers', JSON.stringify(currentValue));
  });

  onDestroy(unsubscribeUserOnDb);

  onDestroy(unsubscribeGradeTally);

  onDestroy(unsubscribeAssignmentIndex);
</script>

<div class="md:w-2/5">
  {#if isLoading}
    <Loader />
  {:else}
    <Handout />
    <section>
      <Form bind:value={code} {submitAnswer} {updateIndex} {isInCorrect} />
    </section>

    <section>
      <h3>User submissions</h3>
      <p>Current User exists: {currentUserOnDb?.exists}</p>

      <div>
        <!--  {#each $submissions as data}
          <p class={`${data.correct ? 'text-green-500' : 'text-red-500'}`}>
            {data?.correct ? 'Correct' : 'Incorrect'} - {data?.grader_feedback}
          </p>
        {/each} -->

        {#if $submissions.length}
          <p
            class={`${
              $submissions[0].correct ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {$submissions[0]?.correct ? 'Correct' : 'Incorrect'} - {$submissions[0]
              ?.grader_feedback}
          </p>
        {/if}
      </div>
    </section>
  {/if}
</div>
