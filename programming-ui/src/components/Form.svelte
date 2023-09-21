<script>
  export let value;
  export let submitAnswer;
  export let updateIndex;
  export let isInCorrect;
  export let currentAssignmentIndex;
</script>

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
    bind:value
    data-testid="input-answer"
  />

  <button
    type="button"
    class="inline-flex items-center px-5 py-2.5 my-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
    on:click={submitAnswer}
    data-testid="submit-answer"
  >
    Submit your answer
  </button>

  <button
    type="button"
    class={`inline-flex items-center px-5 py-2.5 text-sm font-medium text-center rounded-lg text-gray-800 focus:ring-4 ${
      isInCorrect
        ? 'bg-white'
        : 'bg-white border border-gray-300 rounded shadow hover:bg-gray-100'
    }`}
    on:click={updateIndex}
    disabled={isInCorrect}
  >
    {isInCorrect
      ? `Working on problem #: ${currentAssignmentIndex + 1}`
      : 'Answer next assignment'}
  </button>
</form>
