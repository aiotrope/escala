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
  try {
    const response = await fetch(
      `/api/assignments/submissions/${submissionId}`
    );

    if (!response.ok) {
      throw new Error(
        `${response.status} - ${response.statusText} - ${submissionId} not found!`
      );
    }
    return await response.json();
  } catch (error) {
    alert(error);
  }
};

const fetchAllUserSubmission = async (userUuid) => {
  try {
    const response = await fetch(
      `/api/assignments/submissions/user/all/${userUuid}`
    );

    if (!response.ok) {
      throw new Error(
        `${response.status} - ${response.statusText} - Error fetching all ${userUuid} submissions!`
      );
    }
    const jsonData = await response.json();

    const userGradedSubmissions = jsonData.filter(
      (json) => json?.status === 'processed' && json?.grader_feedback !== null
    );

    return userGradedSubmissions;
  } catch (error) {
    alert(error);
  }
};

const createSubmission = async (userUuid, code, assignmentIndex) => {
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
        `${response.status} - ${response.statusText} - Cannot submit answer!`
      );
    }

    // console.log(jsonData);

    return await response.json();
  } catch (error) {
    alert(error);
  }
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

const updateSubmission = async (submissionId, gradingData) => {
  const payload = {
    grader_feedback: gradingData?.result,
    status: gradingData?.result ? 'processed' : 'pending',
    correct: gradingData?.result === 'passes test' ? true : false,
    score: gradingData?.result === 'passes test' ? 100 : 0,
  };

  const options = {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  };

  // let assignmentOrder = assignmentIndex + 1;

  try {
    const url = `/api/assignments/submissions/${submissionId}`;

    const response = await fetch(url, options);

    return await response.json();
  } catch (error) {
    alert(error);
  }
};

const fetchAllAssignments = async () => {
  try {
    const response = await fetch('/api/assignments');

    if (!response.ok) {
      throw new Error(
        `${response.status} - ${response.statusText} - Error fetching all assignments!`
      );
    }

    return await response.json();
  } catch (error) {
    alert(error);
  }
};

const fetchCurrentUserSavedOnDb = async (userUuid) => {
  try {
    const response = await fetch(`/api/user/${userUuid}`);

    if (!response.ok) {
      throw new Error(
        `${response.status} - ${response.statusText} - Error fetching ${userUuid}!`
      );
    }

    return await response.json();
  } catch (error) {
    alert(error);
  }
};

const assignmentService = {
  checkUserExists,
  findCurrentUserLastSubmission,
  findSubmissionById,
  createSubmission,
  fetchAllUserSubmission,
  gradeSubmission,
  updateSubmission,
  fetchAllAssignments,
  fetchCurrentUserSavedOnDb,
};

export default assignmentService;
