import http from 'k6/http';

export const options = {
  duration: '10s',
  vus: 99,
  summaryTrendStats: ['avg', 'p(99)'],
};

export default function () {
  //* adding submission has 3 parameters depending on the id of the assignment
  //* performance test the assignment with id of 3 
  const url = 'http://localhost:7800/api/assignments/3';

  const payload = JSON.stringify({
    code: 'def sum (x, y): \n    return x + y',
    user_uuid: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
