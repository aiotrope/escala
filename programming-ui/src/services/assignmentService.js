const getAllAssignments = async () => {
  const response = await fetch('/api/assignments');
  const jsonData = await response.json();

  return jsonData;
};

const checkUserExists = async (uuid) => {
  const response = await fetch(`/api/user/${uuid}`);

  const jsonData = await response.json();
  return jsonData;
};

const createAnswer = async (userUuid, code, assignmentIndex) => {
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

  let url = `/api/assignments/${assignmentOrder}`;

  const response = await fetch(url, options);

  const jsonData = await response.json();

  return jsonData;
};

const getSubmission = async (submissionId) => {
  const response = await fetch(`/api/assignments/submissions/${submissionId}`);
  const jsonData = await response.json();
  return jsonData;
};

const requestForGrading = async (code, assignmentIndex) => {
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

  let assignmentOrder = assignmentIndex + 1;

  const url = `/api/assignments/grading/${assignmentOrder}`;

  const response = await fetch(url, options);

  const jsonData = await response.json();
  return jsonData;
};

const updateUserAssignmentSubmission = async (
  assignmentOrder,
  userUuid,
  gradingResponse
) => {
  const url = `/api/assignments/submissions/${assignmentOrder}/${userUuid}`;

  const payload = {
    grader_feedback: gradingResponse?.result,
    status: gradingResponse?.result ? 'processed' : 'pending',
    correct: gradingResponse?.result === 'passes test' ? true : false,
    score: gradingResponse?.result === 'passes test' ? 100 : 0,
  };

  const options = {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  };

  const response = await fetch(url, options);

  const jsonData = await response.json();

  return jsonData;
};

const assignmentService = {
  getAllAssignments,
  createAnswer,
  getSubmission,
  checkUserExists,
  requestForGrading,
  updateUserAssignmentSubmission,
};

export default assignmentService;
