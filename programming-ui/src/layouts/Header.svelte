<script>
  import { userUuid } from '../stores/stores.js';
</script>

<nav class="flex items-center justify-between flex-wrap bg-slate-500 p-6">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <span class="font-semibold text-xl tracking-tight"
      >Assignments</span
    >
  </div>

  <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
    <div class="text-sm lg:flex-grow">
      <span
        href="#responsive-header"
        class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
      >
        User: {$userUuid}
      </span>
    </div>
    <div>
      <span
        class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white mt-4 lg:mt-0"
        >Points: 0</span
      >
    </div>
  </div>
</nav>
