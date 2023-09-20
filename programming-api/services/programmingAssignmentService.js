import { sql } from '../database/database.js';

const findAll = async () => {
  const assignments = await sql`SELECT * FROM programming_assignments;`;
  return assignments;
};

const findOne = async (id) => {
  const assignments =
    await sql`SELECT * FROM programming_assignments WHERE id=${id};`;

  return assignments[0];
};

const answerAssignment = async (programming_assignment_id, code, user_uuid) => {
  const submission =
    await sql`INSERT INTO programming_assignment_submissions (programming_assignment_id, code, user_uuid) 
  VALUES (${programming_assignment_id}, ${code}, ${user_uuid});`;

  return submission;
};

const findUserLatestSubmission = async (
  programming_assignment_id,
  user_uuid
) => {
  const submission = await sql`SELECT * from programming_assignment_submissions 
    WHERE programming_assignment_id=${programming_assignment_id} AND user_uuid=${user_uuid} 
    ORDER BY last_updated DESC limit 1;`;

  return submission[0];
};

const findSubmissionById = async (submissionId) => {
  const submissions =
    await sql`SELECT * FROM programming_assignment_submissions WHERE id=${submissionId};`;

  return submissions[0];
};

const getAllAnswers = async () => {
  const answers = await sql`SELECT * FROM programming_assignment_submissions;`;
  return answers;
};

const checkUserExists = async (user_uuid) => {
  const user =
    await sql`SELECT EXISTS (select 1 FROM programming_assignment_submissions WHERE user_uuid=${user_uuid})`;
  return user;
};

const getAllSubmissionsByUser = async (user_uuid) => {
  const submissionsByUser =
    await sql`SELECT * from programming_assignment_submissions WHERE user_uuid=${user_uuid} ORDER BY last_updated DESC;`;

  return submissionsByUser;
};

const updateSubmission = async (id, grader_feedback, status, correct) => {
  return await new Promise(async (resolve, reject) => {
    const updateData = {
      id: id,
      grader_feedback: grader_feedback,
      status: status,
      correct: correct,
    };
    const submissionToUpdate =
      await sql`UPDATE programming_assignment_submissions SET ${sql(
        updateData,
        'grader_feedback',
        'status',
        'correct'
      )} WHERE id=${updateData.id} returning *;`;

    resolve(submissionToUpdate);
  });
};

const gradeSubmission = async (submission) => {
  try {
    const assignment = await findOne(submission?.programming_assignment_id);

    const data = {
      testCode: assignment?.test_code,
      code: submission?.code,
    };

    const response = await fetch('http://grader-api:7000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};




export {
  findAll,
  findOne,
  answerAssignment,
  getAllAnswers,
  checkUserExists,
  updateSubmission,
  findUserLatestSubmission,
  findSubmissionById,
  getAllSubmissionsByUser,
  gradeSubmission,
};
