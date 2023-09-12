const getAllAssignments = async (list) => {
  try {
    const response = await fetch('/api/assignments');

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    const jsonData = await response.json();

    list.set(jsonData);

    return jsonData;
  } catch (error) {
    alert(error);
  }
};

const createAnswer = async (
  userUuid,
  code,
  assignmentIndex,
  submissionStore
) => {
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

  try {
    const response = await fetch(url, options);

    if (response.status !== 201) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    const jsonData = await response.json();

    code = '';

    // console.log('RESULT OF TEST', jsonData);

    submissionStore.update((currentData) => {
      currentData.push(jsonData);
      return currentData;
    });

    return jsonData;
  } catch (error) {
    alert(error);
  }
};

const getSubmission = async (submissionId) => {
  try {
    const response = await fetch(
      `/api/assignments/submissions/${submissionId}`
    );

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    const jsonData = await response.json();

    return jsonData;
  } catch (error) {
    alert(error);
  }
};

const assignmentService = {
  getAllAssignments,
  createAnswer,
  getSubmission,
};

export default assignmentService;
