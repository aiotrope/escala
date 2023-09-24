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

  let currentAnswers;

  let isLoading = true;

  onMount(async () => {
    const interval = setInterval(async () => {
      const allAssignments = await assignmentService.fetchAllAssignments();

      assignments.set(allAssignments);

      if ($assignments.length) {
        const setUserId = await assignmentService.getUser();

        const allAnswers = await assignmentService.findAllAnswers();

        const userSubmissions = await assignmentService.fetchAllUserSubmission(
          $userUuid
        );

        const userSavedOnDb = await assignmentService.checkUserExists(
          $userUuid
        );

        userUuid.set(setUserId);

        answers.set(allAnswers);

        userOnDb.set(userSavedOnDb);

        submissions.set(userSubmissions);

        if ($submissions.length > 0 && $submissions !== undefined) {
          const userGradedSubmissions = $submissions.filter(
            (json) =>
              json?.status === 'processed' && json?.grader_feedback !== null
          );

          const countSub1 = userGradedSubmissions?.filter(
            (sub) =>
              sub?.programming_assignment_id === 1 &&
              sub?.status === 'processed' &&
              sub?.correct
          ).length;
          const countSub2 = userGradedSubmissions?.filter(
            (sub) =>
              sub?.programming_assignment_id === 2 &&
              sub?.status === 'processed' &&
              sub?.correct
          ).length;
          const countSub3 = userGradedSubmissions?.filter(
            (sub) =>
              sub?.programming_assignment_id === 3 &&
              sub?.status === 'processed' &&
              sub?.correct
          ).length;

          const sub1 = countSub1 > 0 ? 100 : 0;
          const sub2 = countSub2 > 0 ? 100 : 0;
          const sub3 = countSub3 > 0 ? 100 : 0;

          const points = sub1 + sub2 + sub3;

          const processedSubmissions = $answers?.filter(
            (sub) => sub?.status === 'processed' && sub?.user_uuid === $userUuid
          );

          const userCurrentCode = processedSubmissions[0]?.code;

          code = userCurrentCode;

          const assignmentId =
            processedSubmissions[0]?.programming_assignment_id;

          const index = $assignments.map((i) => i.id).indexOf(assignmentId);

          gradeTally.set(points);

          assignmentIndex.set(index);

          isLoading = false;

          clearInterval(interval);
        }
        isLoading = false;

        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  });

  const userWithSubmission = async () => {
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
        const addedUpdatedSubmission = await assignmentService.updateSubmission(
          createSubmission
        );

        $submissions = [...$submissions, addedUpdatedSubmission];

        await userWithSubmission();

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

  const unsubscribeAssignments = assignments.subscribe((currentValue) => {
    localStorage.setItem('assignments', JSON.stringify(currentValue));
  });

  const unsubscribeAnswers = assignments.subscribe((currentValue) => {
    currentAnswers = currentValue;
  });

  onDestroy(unsubscribeUserOnDb);

  onDestroy(unsubscribeGradeTally);

  onDestroy(unsubscribeAssignmentIndex);

  onDestroy(unsubscribeAnswers);

  onDestroy(unsubscribeAssignments);
</script>

<div class="md:w-2/5">
  {#if isLoading}
    <Loader />
  {:else}
    <Handout />
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

      <div>
        {#each $submissions as data}
          <p class={`${data.correct ? 'text-green-500' : 'text-red-500'}`}>
            {data?.correct ? 'Correct' : 'Incorrect'} - {data?.grader_feedback}
          </p>
        {/each}
      </div>
    </section>
  {/if}
</div>
