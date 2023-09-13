const checkUserExists = async (uuid) => {
  const response = await fetch(`/api/user/${uuid}`);

  const jsonData = await response.json();
  return jsonData;
};

const assignmentService = {
  checkUserExists,
};

export default assignmentService;
