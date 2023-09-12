<script>
  import { onDestroy } from 'svelte';

  import {
    userUuid,
    assignments,
    submissions,
    userGrades,
  } from '../stores/store.js';

  import assignmentService from '../services/assignmentService.js';

  let assignmentIndex = 0;

  let code;

  let submissionsContent;

  const submitAnswer = async () =>
    await assignmentService.createAnswer(
      $userUuid,
      code,
      assignmentIndex,
      submissions
    );

  const gradeUserAnswer = async () => {
    const payload = {
      code: code,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    };

    try {
      let assignmentOrder = assignmentIndex + 1;

      const url = `/api/assignments/grading/${assignmentOrder}`;

      const response = await fetch(url, options);

      if (!response.ok)
        throw new Error(`${response.status} - ${response.statusText}`);

      const jsonData = await response.json();

      if (jsonData?.result) {
        const updateUrl = `/api/assignments/submissions/${assignmentOrder}/${$userUuid}`;

        const updatePayload = {
          grader_feedback: jsonData?.result,
          status: jsonData?.result ? 'processed' : 'pending',
          correct: jsonData?.result === 'passes test' ? true : false,
          score: jsonData?.result === 'passes test' ? 100 : 0,
        };

        const updateOptions = {
          method: 'PATCH',
          body: JSON.stringify(updatePayload),
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        };

        const updateResponse = await fetch(updateUrl, updateOptions);

        const json = await updateResponse.json();

        let latestUserSubmission = $submissions.find(
          (sub) => sub.programming_assignment_id === assignmentOrder
        );

        let data = {
          ...json,
          submissionId: latestUserSubmission?.id,
          assignmentId: assignmentOrder,
        };

        userGrades.update((currentData) => {
          currentData.push(data);
          return currentData;
        });

        code = '';

        return json;
      }
    } catch (error) {
      alert(error);
    }
  };

  let unsubscribeSubmission = submissions.subscribe((currentValue) => {
    //* run the the function after successive submissions store update
    submissionsContent = currentValue;
    gradeUserAnswer();
  });

  const updateIndex = () => {
    assignmentIndex++;
    assignmentIndex %= $assignments.length;
  };

  onDestroy(unsubscribeSubmission);
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
  <div class="mt-2 mb-8">
    <p class="text-xl my-2">Problem Handout</p>
    <p class="text-base my-2 md:text-lg">
      {$assignments[assignmentIndex]?.handout}
    </p>
  </div>

  <div>
    <form>
      <label
        for="code"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Your code answer</label
      >
      <textarea
        id="code"
        rows="4"
        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
        placeholder="Write your code answer here..."
        bind:value={code}
      />

      <button
        type="button"
        class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        on:click={submitAnswer}
      >
        Submit your answer
      </button>

      <button
        type="button"
        class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-slate-500 rounded-lg focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-900 hover:bg-slate-600"
        on:click={updateIndex}
      >
        Next Problem
      </button>
    </form>
  </div>
  <div class="my-10">
    {#if $userGrades?.length}
      <ul>
        {#each $userGrades as data}
          <li>
            {#if data?.submissionId}
              {data?.submissionId} - {data?.assignmentId} - {data?.score} - {data?.correct
                ? 'Correct'
                : 'Incorrect'}
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p>Error loading data</p>
    {/if}
  </div>
</div>
