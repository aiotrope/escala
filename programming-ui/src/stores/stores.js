import { readable, writable } from 'svelte/store';

/* let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
} */

let user = ''

let userUuid = writable(user);

let assignmentList = [];

let userOnDb = writable({});

const assignments = writable(assignmentList);

let submissions = writable([]);

let gradeTally = writable(0);

let assignmentIndex = writable(0)

export { userUuid, assignments, submissions, userOnDb, gradeTally, assignmentIndex };
