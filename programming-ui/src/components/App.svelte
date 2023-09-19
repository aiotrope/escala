<script>
  import { onDestroy, onMount } from 'svelte';

  import {
    userUuid,
    assignments,
    submissions,
    userOnDb,
    gradeTally,
  } from '../stores/stores.js';

  import assignmentService from '../services/assignmentService.js';

  import TopBar from './TopBar.svelte';

  import Form from './Form.svelte';

  let assignmentIndex = 0;

  let code;

  let currentUserOnDb;

  let currentSubmissions;

  let currentGradeTally;

  let queue = [];

  let isInCorrect = true;

  onMount(async () => {
    const userSavedOnDb = await assignmentService.fetchCurrentUserSavedOnDb(
      $userUuid
    );

    userOnDb.set(userSavedOnDb);
  });

  onMount(async () => {
    const allAssignments = await assignmentService.fetchAllAssignments();

    assignments.set(allAssignments);
  });

  onMount(async () => {
    let fetchInterval = setInterval(async () => {
      const userSubmissions = await assignmentService.fetchAllUserSubmission(
        $userUuid
      );

      submissions.set(userSubmissions);
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
    };
  });

  const submitAnswer = async () => {
    const createSubmission = await assignmentService.createSubmission(
      $userUuid,
      code,
      assignmentIndex
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

      if (foundCodeAndAssignmentDuplicate) {
        alert('Identical code on a given assignment. Submission not graded!');
      }
    }
    code = isInCorrect ? code : '';
  };

  const updateIndex = () => {
    assignmentIndex++;
    isInCorrect = true;
    assignmentIndex %= $assignments.length;
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

  onDestroy(unsubscribeUserOnDb);

  onDestroy(unsubscribeSubmission);

  onDestroy(unsubscribeGradeTally);
</script>

<div class="md:w-2/5">
  <div class="my-5">
    <p>
      There are {$assignments.length} Python problem sets needed to be answered.
    </p>
  </div>

  <h1 class="text-2xl mb-5">
    Problem # {$assignments[assignmentIndex]?.assignment_order}: {$assignments[
      assignmentIndex
    ]?.title}
  </h1>
  <section class="mt-2 mb-8">
    <p class="text-xl my-2">Problem Handout</p>
    <p class="text-base my-2 md:text-lg">
      {$assignments[assignmentIndex]?.handout}
    </p>
  </section>

  <section>
    <Form
      bind:value={code}
      {submitAnswer}
      {updateIndex}
      {isInCorrect}
      {assignmentIndex}
    />
  </section>

  <section>
    <h3>User submissions</h3>
    <p>Current User exists: {currentUserOnDb?.exists}</p>

    {#if currentSubmissions?.length}
      <ul>
        {#each currentSubmissions as data}
          <li>
            {#if data?.id}
              {data?.id} - {data?.programming_assignment_id} - {data?.grader_feedback}
              - {data?.correct ? 'Correct' : 'Incorrect'}
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p>
        There are {$assignments.length} Python problem sets needed to be answered.
      </p>
    {/if}
  </section>
</div>
