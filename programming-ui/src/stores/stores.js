import { readable, writable } from 'svelte/store';

import assignmentService from '../services/assignmentService';

let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
}

const userUuid = readable(user);

let assignmentList = [];

const assignments = writable(assignmentList);

let submissions = writable([]);

let userGrades = writable([]);

assignmentService.getAllAssignments(assignments);

export { userUuid, assignments, submissions, userGrades };
