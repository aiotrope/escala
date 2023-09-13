import { readable, writable } from 'svelte/store';

let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
}

const userUuid = readable(user);

let assignmentList = [];

let userOnDb = writable({});

const assignments = writable(assignmentList);

let submissions = writable([]);

let userGrades = writable([]);

export { userUuid, assignments, submissions, userGrades, userOnDb };
