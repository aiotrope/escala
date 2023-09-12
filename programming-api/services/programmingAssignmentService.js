import { sql } from '../database/database.js';

const findAll = async () => {
  const assignments = await sql`SELECT * FROM programming_assignments;`;
  return assignments;
};

const findOne = async (id) => {
  const assignments =
    await sql`select * from programming_assignments where id=${id};`;

  return assignments[0];
};

const answerAssignment = async (programming_assignment_id, code, user_uuid) => {
  
  await sql`INSERT INTO programming_assignment_submissions (programming_assignment_id, code, user_uuid) 
  VALUES (${programming_assignment_id}, ${code}, ${user_uuid});`
  
};

const findUserLatestSubmission = async (
  programming_assignment_id,
  user_uuid
) => {
  const submission = await sql`select * from programming_assignment_submissions 
    where programming_assignment_id=${programming_assignment_id} and user_uuid=${user_uuid} 
    order by last_updated DESC limit 1;`;

  return submission;
};

const findSubmissionById = async (submissionId) => {
  const submissions =
    await sql`select * from programming_assignment_submissions where id=${submissionId};`;

  return submissions[0];

}

const getAllAnswers = async () => {
  const answers = await sql`SELECT * FROM programming_assignment_submissions;`;
  return answers;
};

const checkUserExists = async (user_uuid) => {
  const user =
    await sql`select exists(select 1 from programming_assignment_submissions where user_uuid=${user_uuid})`;
  return user;
};

const updateUserSubmission = async (
  programming_assignment_id,
  user_uuid,
  grader_feedback,
  status,
  correct,
  score
) => {
  const submissions = {
    grader_feedback: grader_feedback,
    status: status,
    correct: correct,
    score: score,
  };
  await sql`update programming_assignment_submissions set ${sql(
    submissions,
    'grader_feedback',
    'status',
    'correct',
    'score'
  )} where programming_assignment_id=${programming_assignment_id} and user_uuid=${user_uuid};`;
};

export {
  findAll,
  findOne,
  answerAssignment,
  getAllAnswers,
  checkUserExists,
  updateUserSubmission,
  findUserLatestSubmission,
  findSubmissionById
};
