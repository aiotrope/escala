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
          `${response.status} - ${response.statusText} - Cannot submit answer!`
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

const getTotalPoints = async (submission) => {
  let sub1 = 0;
  let sub2 = 0;
  let sub3 = 0;

  const submissions = await fetchAllUserSubmission(submission?.user_uuid);

  const newSubmission = submissions[0];

  console.log(newSubmission);

  if (newSubmission?.correct && submission?.programming_assignment_id === 1) {
    sub1 = 100;
  }

  if (newSubmission?.correct && submission?.programming_assignment_id === 2) {
    sub2 = 100;
  }

  if (newSubmission?.correct && submission?.programming_assignment_id === 3) {
    sub3 = 100;
  }

  let points = sub1 + sub2 + sub3;
  return points;
};

const deleteUser = async (userId) => {
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  };
  try {
    const url = `/api/assignments/submissions/user/${userId}`;

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `${response.status} - ${response.statusText} - Error deleting user!`
      );
    }

    return response;
  } catch (error) {
    console.error(error);
  }
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
  getTotalPoints,
  deleteUser,
};

export default assignmentService;
