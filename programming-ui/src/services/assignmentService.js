const findAllAnswers = async () => {
  const response = await fetch('/api/answers');

  return await response.json();
};
const checkUserExists = async (uuid) => {
  const response = await fetch(`/api/user/${uuid}`);

  return await response.json();
};

const findCurrentUserLastSubmission = async (assignmentId, userId) => {
  const response = await fetch(
    `/api/assignments/submissions/latest-submission/${assignmentId}/${userId}`
  );

  return await response.json();
};

const findSubmissionById = async (submissionId) => {
  const response = await fetch(`/api/assignments/submissions/${submissionId}`);
  return await response.json();
};

const fetchAllUserSubmission = async (userUuid) => {
  const response = await fetch(
    `/api/assignments/submissions/user/all/${userUuid}`
  );

  const jsonData = await response.json();

  const userGradedSubmissions = jsonData.filter(
    (json) => json?.status === 'processed' && json?.grader_feedback !== null
  );

  return userGradedSubmissions;
};

const createSubmission = async (userUuid, code, assignmentIndex) => {
  return await new Promise(async (resolve, reject) => {
    const payload = {
      user_uuid: userUuid,
      code: code,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    };

    let assignmentOrder = assignmentIndex + 1;
    try {
      let url = `/api/assignments/${assignmentOrder}`;

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `${response.status} - ${response.statusText}  - Code field is empty or previous submissions are not yet resolve`
        );
      }

      const jsonData = await response.json();

      resolve(jsonData);
    } catch (error) {
      alert(error);
    }
  });
};

const gradeSubmission = async (code, assignmentId) => {
  const payload = {
    code: code,
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  };

  try {
    const url = `/api/assignments/grading/${assignmentId}`;

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `${response.status} - ${response.statusText} - Error grading the submitted assignment!`
      );
    }

    return await response.json();
  } catch (error) {
    alert(error);
  }
};

const gradeSubmissionPromise = async (createSubmission) => {
  return await new Promise((resolve, reject) => {
    setTimeout(async () => {
      const submissionForGrading = await gradeSubmission(
        createSubmission?.code,
        createSubmission?.programming_assignment_id
      );
      resolve(submissionForGrading);
    }, 2000);
  });
};

const updateSubmission = async (createdSubmission) => {
  const payload = {
    grader_feedback: createdSubmission?.result,
    status: 'processed',
    correct: createdSubmission?.result === 'passes test' ? true : false,
  };

  const options = {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  };

  try {
    const url = `/api/assignments/submissions/${createdSubmission?.id}`;

    const response = await fetch(url, options);

    return await response.json();
  } catch (error) {
    alert(error);
  }
};

const fetchAllAssignments = async () => {
  const response = await fetch('/api/assignments');

  return await response.json();
};

const fetchCurrentUserSavedOnDb = async (userUuid) => {
  const response = await fetch(`/api/user/${userUuid}`);

  return await response.json();
};

const assignmentService = {
  checkUserExists,
  findCurrentUserLastSubmission,
  findSubmissionById,
  createSubmission,
  fetchAllUserSubmission,
  updateSubmission,
  fetchAllAssignments,
  fetchCurrentUserSavedOnDb,
  gradeSubmission,
  gradeSubmissionPromise,
  findAllAnswers,
};

export default assignmentService;
