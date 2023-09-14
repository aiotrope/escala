<script>
  import { onDestroy, onMount } from 'svelte';

  import {
    userUuid,
    assignments,
    submissions,
    userGrades,
    userOnDb,
  } from '../stores/stores.js';

  import assignmentService from '../services/assignmentService.js';

  import Form from './Form.svelte';

  let assignmentIndex = 0;

  let code;

  let currentUserOnDb;

  let currentSubmissions;

  let currentUserGrades;

  onMount(async () => {
    try {
      const response = await fetch(`/api/user/${$userUuid}`);

      const jsonData = await response.json();

      userOnDb.set(jsonData);

      return jsonData;
    } catch (error) {
      alert(error);
    }
  });

  onMount(async () => {
    try {
      const response = await fetch('/api/assignments');

      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error(
          `${response.status} - ${response.statusText} - Error fetching all assignments!`
        );
      }

      assignments.set(jsonData);

      return jsonData;
    } catch (error) {
      alert(error);
    }
  });

  onMount(async () => {
    let fetchInterval = setInterval(async () => {
      const response = await fetch(
        `/api/assignments/submissions/user/all/${$userUuid}`
      );
      const data = await response.json();

      console.log(data);

      submissions.set(data);

      return data;
    }, 8000); // increase ms for testing

    return () => clearInterval(fetchInterval)
  });

  const gradeAnswer = async () => {
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

    let assignmentOrder = assignmentIndex + 1;

    try {
      let url = `/api/assignments/${assignmentOrder}`;

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `${response.status} - ${response.statusText} - Cannot submit answer!`
        );
      }

      const jsonData = await response.json();

      const userExists = await assignmentService.checkUserExists($userUuid);

      if (userExists?.exists) {
        $submissions = [...$submissions, jsonData];

        userOnDb.update((currentData) => ({ ...currentData, ...userExists }));

        const gradingUrl = `/api/assignments/grading/${assignmentOrder}`;

        const gradingResponse = await fetch(gradingUrl, options);

        const gradingData = await gradingResponse.json();

        if (gradingData?.result) {
          const updateUrl = `/api/assignments/submissions/${assignmentOrder}/${$userUuid}`;

          const updatePayload = {
            grader_feedback: gradingData?.result,
            status: gradingData?.result ? 'processed' : 'pending',
            correct: gradingData?.result === 'passes test' ? true : false,
            score: gradingData?.result === 'passes test' ? 100 : 0,
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

          const updateData = await updateResponse.json();

          // console.log(updateData);

          code = '';

          return updateData;
        }
        return gradingData;
      }

      return jsonData;
    } catch (error) {
      alert(error);
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

  let unsubscribeUserGrades = userGrades.subscribe((currentValue) => {
    currentUserGrades = currentValue;
  });

  onDestroy(unsubscribeUserOnDb);

  onDestroy(unsubscribeSubmission);

  onDestroy(unsubscribeUserGrades);

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
  </section>
</div>
