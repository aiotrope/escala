import * as programmingAssignmentService from './services/programmingAssignmentService.js';
// import { serve } from './deps.js';
// import { sql } from './database/database.js';

const handleFindAll = async () => {
  try {
    const assignments = await programmingAssignmentService.findAll();

    return Response.json(assignments, { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 422 });
  }
};

const handleFindOne = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;

  try {
    const assignment = await programmingAssignmentService.findOne(id);
    return Response.json(assignment, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 404 });
  }
};

const handleAnswerAssignment = async (request, urlPatternResult) => {
  try {
    const body = await request.text();
    const json = await JSON.parse(body);
    const programming_assignment_id = urlPatternResult.pathname.groups.id;

    if (
      json?.code?.length > 0 &&
      json?.code !== '' &&
      json?.user_uuid?.length > 0 &&
      json?.user_uuid !== ''
    ) {
      await programmingAssignmentService.answerAssignment(
        programming_assignment_id,
        json.code,
        json.user_uuid
      );

      const submission =
        await programmingAssignmentService.findUserLatestSubmission(
          programming_assignment_id,
          json.user_uuid
        );

      return Response.json(submission[0], { status: 200 });
    } else {
      return new Response('Code field is required!', { status: 400 });
    }
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};

const handleGrading = async (request, urlPatternResult) => {
  try {
    const body = await request.text();
    const json = await JSON.parse(body);
    const programming_assignment_id = urlPatternResult.pathname.groups.id;

    const assignment = await programmingAssignmentService.findOne(
      programming_assignment_id
    );

    const data = {
      testCode: assignment?.test_code,
      code: json?.code,
    };

    const response = await fetch('http://grader-api:7001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(JSON.stringify(response));

    return response;
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};

const handleGetAllAnswers = async () => {
  try {
    const answers = await programmingAssignmentService.getAllAnswers();

    return Response.json(answers, { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 422 });
  }
};

const handleUpdateSubmission = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;

  try {
    const body = await request.text();
    const json = await JSON.parse(body);

    await programmingAssignmentService.updateSubmission(
      id,
      json.grader_feedback,
      json?.status,
      json?.correct,
      json?.score
    );

    const submission = await programmingAssignmentService.findSubmissionById(
      id
    );

    return Response.json(submission, { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};

const handleCheckUserExists = async (request, urlPatternResult) => {
  const user_uuid = urlPatternResult.pathname.groups.user_uuid;

  try {
    const exists = await programmingAssignmentService.checkUserExists(
      user_uuid
    );
    return Response.json(exists[0], { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 422 });
  }
};

const handleFindSubmission = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id;
    const submission = await programmingAssignmentService.findSubmissionById(
      id
    );

    console.log(submission);

    return Response.json(submission, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 422 });
  }
};

const handleSubmissionsByUser = async (request, urlPatternResult) => {
  try {
    const user_uuid = urlPatternResult.pathname.groups.user_uuid;

    const userSubmissions =
      await programmingAssignmentService.getAllSubmissionsByUser(user_uuid);

    return Response.json(userSubmissions, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 404 });
  }
};

const handleGetUserLatestSubmission = async (request, urlPatternResult) => {
  const programming_assignment_id =
    urlPatternResult.pathname.groups.programming_assignment_id;

  const user_uuid = urlPatternResult.pathname.groups.user_uuid;

  try {
    const userLatestSubmission =
      await programmingAssignmentService.findUserLatestSubmission(
        programming_assignment_id,
        user_uuid
      );

    return Response.json(userLatestSubmission[0], { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 404 });
  }
};

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/assignments' }),
    fn: handleFindAll,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/assignments/:id' }),
    fn: handleFindOne,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/assignments/:id' }),
    fn: handleAnswerAssignment,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/assignments/grading/:id' }),
    fn: handleGrading,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/answers' }),
    fn: handleGetAllAnswers,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/user/:user_uuid' }),
    fn: handleCheckUserExists,
  },
  {
    method: 'PATCH',
    pattern: new URLPattern({
      pathname: '/assignments/submissions/:id',
    }),
    fn: handleUpdateSubmission,
  },
  {
    method: 'GET',
    pattern: new URLPattern({
      pathname: '/assignments/submissions/:id',
    }),
    fn: handleFindSubmission,
  },
  {
    method: 'GET',
    pattern: new URLPattern({
      pathname: '/assignments/submissions/user/all/:user_uuid',
    }),
    fn: handleSubmissionsByUser,
  },
  {
    method: 'GET',
    pattern: new URLPattern({
      pathname:
        '/assignments/submissions/latest-submission/:programming_assignment_id/:user_uuid',
    }),
    fn: handleGetUserLatestSubmission,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response('Not found', { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);

  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 });
  }
};

const handleHttpConnection = async (conn) => {
  for await (const requestEvent of Deno.serveHttp(conn)) {
    requestEvent.respondWith(await handleRequest(requestEvent.request));
  }
};

const portConfig = { port: 7777, hostname: '0.0.0.0' };

for await (const conn of Deno.listen(portConfig)) {
  handleHttpConnection(conn);
}
