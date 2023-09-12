import { readable, writable } from 'svelte/store';

import assignmentService from '../services/assignmentService';

let user = localStorage.getItem('userUuid');

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
}

const userUuid = readable(user);

let assignmentList = [];

let userOnDb = writable({})

const assignments = writable(assignmentList);


let submissions = writable([]);

let userGrades = writable([]);

assignmentService.getAllAssignments(assignments);

const exists = async () =>
  await assignmentService.checkUserExists(userOnDb, user);

exists()

export { userUuid, assignments, submissions, userGrades, userOnDb };
