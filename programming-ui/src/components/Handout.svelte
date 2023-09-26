<script>
  import { assignments, assignmentIndex } from '../stores/stores.js';
</script>

<div class="my-5">
  <p>
    There are {$assignments.length} Python problem sets needed to be answered.
  </p>
</div>

<h1 class="text-2xl mb-5" id="problem">
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
