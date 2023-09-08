import { sql } from '../database/database.js';

const findAll = async () => {
  const assignments = await sql`SELECT * FROM programming_assignments;`;
  return assignments;
};

const findOne = async (id) => {
  const assignments =
    await sql`select * from programming_assignments where id = ${id};`;

  return assignments[0];
};

const answerAssignment = async (programming_assignment_id, code, user_uuid) => {
  await sql`insert into programming_assignment_submissions (programming_assignment_id, code, user_uuid) values (${programming_assignment_id}, ${code}, ${user_uuid});`;
};

const getAllAnswers = async () => {
   const answers = await sql`SELECT * FROM programming_assignment_submissions;`;
   return answers;

}

export { findAll, findOne, answerAssignment, getAllAnswers };
