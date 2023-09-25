import { pLimit } from './deps.js';
import * as programmingAssignmentService from './services/programmingAssignmentService.js';
import { cacheMethodCalls } from './util/cacheUtil.js';

const limit = pLimit(99);

const nonidenticalSubmissions = [];

//* Using redis caching
const cachedProgrammingAssignmentService = cacheMethodCalls(
  programmingAssignmentService,
  ['answerAssignment', 'updateSubmission']
);

//* fetch all assignments
const handleFindAll = async (request) => {
  const assignments = await cachedProgrammingAssignmentService.findAll();

  return Response.json(assignments, { status: 200 });
};

//* get assignments by id
const handleFindOne = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;

  try {
    const assignment = await cachedProgrammingAssignmentService.findOne(id);
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

    if (limit.activeCount !== 0 || limit.pendingCount !== 0) {
      console.log('ACTIVE', limit.activeCount);
      return Response.json(
        { error: 'There are still submissions on process for grading' },
        {
          status: 422,
        }
      );
    }

    if (!json?.code || !json?.user_uuid) {
      return Response.json(
        { error: 'Code field is required!' },
        { status: 400 }
      );
    }

    await cachedProgrammingAssignmentService.answerAssignment(
      programming_assignment_id,
      json?.code,
      json?.user_uuid
    );

    const findUserLatestSubmission =
      await cachedProgrammingAssignmentService.findUserLatestSubmission(
        programming_assignment_id,
        json?.user_uuid
      );

    const userLatestSubmission =
      await cachedProgrammingAssignmentService.findSubmissionById(
        findUserLatestSubmission?.id
      );

    const userSubmissions =
      await cachedProgrammingAssignmentService.getAllSubmissionsByUser(
        userLatestSubmission?.user_uuid
      );

    const foundCodeAndAssignmentDuplicate = userSubmissions.find(
      (sub) =>
        sub?.id !== userLatestSubmission?.id &&
        sub.code === userLatestSubmission?.code &&
        sub?.programming_assignment_id ===
          userLatestSubmission?.programming_assignment_id
    );

    if (!foundCodeAndAssignmentDuplicate) {
      let init = limit(async () => {
        const submission =
          await cachedProgrammingAssignmentService.gradeSubmission(
            userLatestSubmission
          );
        const jsonData = await submission.json();

        const dataAfterSubmission = {
          id: userLatestSubmission?.id,
          user_uuid: userLatestSubmission?.user_uuid,
          programming_assignment_id:
            userLatestSubmission?.programming_assignment_id,
          result: jsonData?.result,
        };

        return dataAfterSubmission;
      });

      nonidenticalSubmissions.push(init);

      const promises = await Promise.all(
        nonidenticalSubmissions.map(async (submission) => {
          nonidenticalSubmissions.splice(
            nonidenticalSubmissions.indexOf(submission),
            1
          );

          return await submission;
        })
      );

      if (
        nonidenticalSubmissions.length === 0 &&
        limit.activeCount === 0 &&
        limit.pendingCount === 0
      ) {
        limit.clearQueue();
      }

      const result = promises.find(
        (promise) => promise.id === userLatestSubmission.id
      );

      console.log('RESULT', result);

      return Response.json(result, {
        status: 200,
      });
    }

    return Response.json(userLatestSubmission, { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};
const handleGrading = async (request, urlPatternResult) => {
  try {
    const body = await request.text();
    const json = await JSON.parse(body);
    const programming_assignment_id = urlPatternResult.pathname.groups.id;

    const assignment = await cachedProgrammingAssignmentService.findOne(
      programming_assignment_id
    );

    const data = {
      testCode: assignment?.test_code,
      code: json?.code,
    };

    const response = await fetch('http://grader-api:7000', {
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

const handleGetAllAnswers = async (request) => {
  try {
    const answers = await cachedProgrammingAssignmentService.getAllAnswers();

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

    await cachedProgrammingAssignmentService.updateSubmission(
      id,
      json.grader_feedback,
      json?.status,
      json?.correct
    );

    const submission =
      await cachedProgrammingAssignmentService.findSubmissionById(id);

    return Response.json(submission, { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};

const handleCheckUserExists = async (request, urlPatternResult) => {
  const user_uuid = urlPatternResult.pathname.groups.user_uuid;

  try {
    const exists = await cachedProgrammingAssignmentService.checkUserExists(
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
    const submission =
      await cachedProgrammingAssignmentService.findSubmissionById(id);

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
      await cachedProgrammingAssignmentService.getAllSubmissionsByUser(
        user_uuid
      );

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
      await cachedProgrammingAssignmentService.findUserLatestSubmission(
        programming_assignment_id,
        user_uuid
      );

    return Response.json(userLatestSubmission, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 404 });
  }
};

const handleGenerateUuid = async (request) => {
  const generate = crypto.randomUUID();
  const uuid = generate;
  return Response.json({ uuid: uuid }, { status: 200 });
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
  {
    method: 'GET',
    pattern: new URLPattern({
      pathname: '/assignments/user/uuid',
    }),
    fn: handleGenerateUuid,
  }
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
