<script>
  import { onMount } from 'svelte';
  import {
    userUuid,
    assignments,
    assignmentsOrdering,
    submissions,
  } from '../stores/assignments.js';

  let assignmentIndex = 0;

  let code;

  onMount(async () => {
    try {
      const response = await fetch('/api/assignments');

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      const jsonData = await response.json();

      const ids = jsonData.map((json) => parseInt(json.id));

      assignments.set(jsonData);

      assignmentsOrdering.set(ids);
    } catch (error) {
      alert(error);
    }
  });

  const submitAnswer = async () => {
    const payload = {
      user_uuid: $userUuid,
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

    let idx = assignmentIndex + 1;

    let url = `/api/assignments/${idx}`;

    try {
      const response = await fetch(url, options);

      if (response.status !== 201) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      const jsonData = await response.json();

      code = '';

      // console.log('BODY', payload);
      // console.log('RESULT OF TEST', jsonData);

      submissions.update((currentData) => {
        currentData.push(jsonData);
        return currentData;
      });

      if (jsonData) {
        const options = {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        };

        const gradingUrl = `/api/assignments/grading/${idx}`;

        const gradingResponse = await fetch(gradingUrl, options);

        const jsonResponse = await gradingResponse.json();

        console.log('RESULT', jsonResponse?.result);

        return jsonResponse;
      }
      return jsonData;
    } catch (err) {
      alert(err);
    }
  };

  const updateIndex = () => {
    assignmentIndex++;
    assignmentIndex %= $assignments.length;
  };
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
    {#if $submissions?.length}
      <ul>
        {#each $submissions as data (data?.id)}
          <li>
            {data?.id} - {data?.programming_assignment_id} - {data?.user_uuid}
          </li>
        {/each}
      </ul>
    {:else}
      <p>Error loading data</p>
    {/if}
  </div>
</div>
