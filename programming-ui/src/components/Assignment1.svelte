<script>
  import { onMount } from 'svelte';

  // import { setContext } from 'svelte';

  //import { Query } from '@sveltestack/svelte-query'
  
  import {
    userUuid,
    assignmentIndex,
    // assignment,
    assignmentIdsOrOrdering,
    userExists,
    // assignments,
    // assignment,
  } from '../stores/stores.js';

  import Assignment1 from './Assignment1.svelte';

  let count = 0;

  let assignments = []

  let assignment = {}

  let title 

  onMount(async function () {
    try {
      const response = await fetch('/api/assignments');

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      const jsonData = await response.json();

      const ids = jsonData.map((json) => parseInt(json.id));

      $assignmentIdsOrOrdering = ids;

      assignments = jsonData;

      //console.log($assignmentIndex);
    } catch (error) {
      alert(error);
    }
  });

  onMount(async function () {
    try {
      const response = await fetch(`/api/assignments/${$assignmentIndex + 1}`);

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      assignment = await response.json();

      title = assignment?.title;
    } catch (error) {
      alert(error);
    }
  });

  /* const fetchAssignment = async () => {
    try {
      const response = await fetch(`/api/assignments/${$assignmentIndex + 1}`);

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      $assignment = await response.json();
    } catch (error) {
      alert(error);
    }
  }; */

  let nextAssignment = () => {
    count++;

    $assignmentIndex.update((existing) => count);
  };

  /* const checkUserExists = async () => {
    try {
      const response = await fetch(`/api/user/${$userUuid}`);

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      $userExists = await response.json();

      if (!userExists.exists) {
        fetchAssignment(assignmentIdsOrOrdering[$assignmentIndex]);
      }
  
    } catch (error) {
      alert(error);
    }
  }; */

  // setContext('idx', $assignmentIndex)
</script>

<div class="md:w-2/5">
  <div class="my-5">
    <p>
      There are {assignments.length} Python problem sets that you need to answer
      for this section.
    </p>
  </div>

  <h1 class="text-2xl mb-5">
    Problem {$assignmentIdsOrOrdering[$assignmentIndex]}: {title}
  </h1>
  <div class="mt-2 mb-8">
    <p class="text-xl my-2">Problem Handout</p>
    <p class="text-base my-2 md:text-lg">{assignment.handout}</p>
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
      />

      <button
        type="submit"
        class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
      >
        Submit your answer
      </button>

      <button
        type="button"
        class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-slate-500 rounded-lg focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-900 hover:bg-slate-600"
        on:click={() => $assignmentIndex++}
      >
        Next Problem
      </button>
    </form>
  </div>
  <div>

    <Assignment1 idx={$assignmentIndex} />
  
  </div>
</div>
