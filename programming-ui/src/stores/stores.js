import { readable, writable } from 'svelte/store';
// import { setContext } from 'svelte';

let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
}



//

let assignment = writable({});

let assignmentIdsOrOrdering = writable([]);

let assignments = writable([]);

let userExists = writable({});

export const userUuid = readable(user);

export {
  assignment,
  userExists,
  assignmentIdsOrOrdering,
  assignments,
};
