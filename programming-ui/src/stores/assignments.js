import { readable, writable } from 'svelte/store';

let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
}

const userUuid = readable(user);

const assignments = writable([]);

let assignmentsOrdering = writable([]);

let submissions = writable([])

export { userUuid, assignments, assignmentsOrdering, submissions };
