import { readable, writable } from 'svelte/store';
import assignmentService from '../services/assignmentService';

let user = JSON.parse(localStorage.getItem('userUuid'));
let assignmentList = JSON.parse(localStorage.getItem('assignments'));
let submissionList = JSON.parse(localStorage.getItem('submissions'));

/* if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', user);
} */

//const getUser = await assignmentService.getUser();

// localStorage.setItem('userUuid', JSON.stringify(getUser));

let userUuid = writable(user);

let userOnDb = writable({});

const assignments = writable(assignmentList);

const answers = writable([]);

let submissions = writable(submissionList);

let gradeTally = writable(0);

let assignmentIndex = writable(0);

export {
  userUuid,
  assignments,
  submissions,
  userOnDb,
  gradeTally,
  assignmentIndex,
  answers,
};
