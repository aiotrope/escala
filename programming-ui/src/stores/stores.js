import { writable } from 'svelte/store';

let user = JSON.parse(localStorage.getItem('userUuid'));
let assignmentList = JSON.parse(localStorage.getItem('assignments'));
let submissionList = JSON.parse(localStorage.getItem('submissions'));
let answerList = JSON.parse(localStorage.getItem('answers'));

let userUuid = writable(user);

let userOnDb = writable({});

const assignments = writable(assignmentList);

const answers = writable(answerList);

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
