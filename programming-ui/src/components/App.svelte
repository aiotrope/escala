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

  import Form from './Form.svelte';

  let assignmentIndex = 0;

  let code;

  let currentUserOnDb;

  let currentSubmissions;

  let currentGradeTally;

  let queue = [];

  let completed;

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

      // console.log(userSubmissions);

      submissions.set(userSubmissions);
    }, 10000); // increase ms for testing

    return () => {
      clearInterval(fetchInterval);
    };
  });

  const gradeAnswer = async () => {
    // user create submission
    const createSubmission = await assignmentService.createSubmissionPromise(
      $userUuid,
      code,
      assignmentIndex
    );

    // console.log(createSubmission)

    code = '';

    const userExists = await assignmentService.checkUserExists($userUuid);

    if (userExists?.exists) {
      userOnDb.update((currentData) => ({ ...currentData, ...userExists }));

      // console.log('SUCCESS SUBMISSION', successSubmission);

      const userLatestSubmission = await assignmentService.findSubmissionById(
        createSubmission?.id
      );

      const foundCodeAndAssignmentDuplicate = currentSubmissions.find(
        (sub) =>
          sub?.id !== userLatestSubmission?.id &&
          sub.code === userLatestSubmission?.code &&
          sub?.programming_assignment_id ===
            userLatestSubmission?.programming_assignment_id
      );

      console.log(foundCodeAndAssignmentDuplicate);

      if (!foundCodeAndAssignmentDuplicate) {
        /* for (const prop of Object.getOwnPropertyNames(successSubmission)) {
          delete successSubmission[prop];
        }
 */
        // console.log('DELETE SUCCESS SUBMISSION', successSubmission);

        queue = [...queue, createSubmission];

        const processSubmissionForGrading = async () => {
          try {
            const processQueues = await Promise.all(
              queue?.map(async (submission) => {
                let gradeSubmission =
                  await assignmentService.gradeSubmissionPromise(submission);

                if (gradeSubmission?.result) {
                  await assignmentService.updateSubmission(
                    createSubmission?.id,
                    gradeSubmission
                  );

                  queue.splice(queue.indexOf(submission), 1);
                  queue = queue;
                }
              })
            );
            return processQueues;
          } catch (error) {
            alert(error);
          }
        };

        let processedSubmission = await processSubmissionForGrading();
      } else {
        alert('Identical code on a given assignment. Submission not graded!');
      }
    }
  };

  const updateIndex = () => {
    assignmentIndex++;
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

  $: console.log(queue.length)
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
    <Form bind:value={code} {gradeAnswer} {updateIndex} />
  </section>

  <section>
    <h3>User submissions</h3>
    <p>Current User exists: {currentUserOnDb?.exists}</p>

    {#if currentSubmissions?.length}
      <ul>
        {#each currentSubmissions as data}
          <li>
            {#if data?.id}
              {data?.id} - {data?.programming_assignment_id} - {data?.score} - {data?.correct
                ? 'Correct'
                : 'Incorrect'}
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p>
        There are {$assignments.length} Python problem sets needed to be answered.
      </p>
    {/if}
    <!--  {#if queueSubmissions?.length}
      <ul>
        {#each queueSubmissions as data}
          <li>
            {#if data?.id}
              {data?.id} - {data?.programming_assignment_id} - {data?.score} - {data?.correct
                ? 'Correct'
                : 'Incorrect'}
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p>
        There are {$assignments.length} Python problem sets needed to be answered.
      </p>
    {/if} -->
  </section>
</div>
