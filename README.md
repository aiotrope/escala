# Designing and Building Scalable Web Applications Course Project I

An application for answering a series of three of Python problem. Each submission will be evaluated for a grade or feedback if the submission is correct or incorrect. Each submission also requires a unique set of code otherwise the submission will not be graded. Correct answer to a problem will allow user to move to next assignment by enabling the next action button. Correct answer also increase the points to 100 and the maximum perfect score is 300. Notification for incorrect answer is "Incorrect" and "Correct" for every correct answer. Every submission will automatically update the grader_feedback, status and correct attributes of programming_assignment_submissions table as long as code is unique pertaining to the last submission on respective assignment. On production mode of the app, the next time the user launches the application, they can pick up where they left off with the initial task.

The steps for constructing this project were carried out in accordance with the requirements specified by Project 1 of the Designing and Building Scalable Web Applications course.

## Running the app

Please refer to the RUNNING.md file on how to run the app in debug and production mode as well as how to run the e2e test and K6 performance test.

## API Reference

### Fetch all assignments

```http
  GET /api/assignments
```

### Get assignment by id

```http
  GET /api/assignments/${id}
```

| Param | Type     | Description   |
| :---- | :------- | :------------ |
| `id`  | `string` | **Required**. |

### Add submission

```http
  POST /api/assignments/${id}. Id params correspond to the assignment id
```

| Param | Type     | Description   |
| :---- | :------- | :------------ |
| `id`  | `string` | **Required**. |

| Body        | Type     | Description  |
| :---------- | :------- | :----------- |
| `code`      | `string` | **Required** |
| `user_uuid` | `string` | **Required** |

### Grade a submission

```http
  POST /api/assignments/grading/${id}. Id params correspond to the assignment id
```

| Param | Type     | Description   |
| :---- | :------- | :------------ |
| `id`  | `string` | **Required**. |

| Body   | Type     | Description  |
| :----- | :------- | :----------- |
| `code` | `string` | **Required** |

### Update a submission

```http
PATCH /api/assignments/submissions/${id}. Id params correspond to the submission id
```

| Param | Type     | Description   |
| :---- | :------- | :------------ |
| `id`  | `string` | **Required**. |

|       Body        | Type      | Description  |
| :---------------: | :-------- | ------------ |
| `grader_feedback` | `string`  | **Required** |
|     `status`      | `string`  | **Required** |
|     `correct`     | `boolean` | **Required** |

### Fetch all submissions

```http
  GET /api/answers
```

### Fetch all submission by user

```http
GET /assignments/submissions/user/all/${user_uuid}
```

| Param       | Type     | Description   |
| :---------- | :------- | :------------ |
| `user_uuid` | `string` | **Required**. |

### Get submission by id

```http
  GET /api/assignments/submissions/${id}
```

| Param | Type     | Description   |
| :---- | :------- | :------------ |
| `id`  | `string` | **Required**. |

### Get user latest submission

```http
  GET /api/assignments/submissions/latest-submission/${programming_assignment_id}/${user_uuid}
```

| Param                       | Type     | Description   |
| :-------------------------- | :------- | :------------ |
| `programming_assignment_id` | `string` | **Required**. |
| `user_uuid`                 | `string` | **Required**. |

### Check user exists

```http
GET /api/user/${user_uuid}
```

| Param       | Type     | Description   |
| :---------- | :------- | :------------ |
| `user_uuid` | `string` | **Required**. |

### Generate user id

```http
GET/api/assignments/user/uuid
```

## Features

### Required

| Feautures                                                                                                                                                        | Status   |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| `*Basic requirements`                                                                                                                                            |  `done`  |
| `Submissions will be saved on DB and unique submission will proceed for grading`                                                                                 |  `done`  |
| `Submissions that are about to be graded will be added on a queue, will process one by one and capable of concurrently process a less than a hundred submission` |  `done`  |
| `Only unique submission per assignment will graded but every submission will be saved on DB`                                                                     |  `done`  |
| `Only unique submission per assignment will automatically be updated`                                                                                            |  `done`  |
| `Short pooling is implemented to updating the submission status`                                                                                                 |  `done`  |
| `Development and production configuration of the app are provided`                                                                                               |  `done`  |
| `Development and production configuration of the app are provided`                                                                                               |  `done`  |
| `The three mandatory e2e test specified are all implemented and test properly`                                                                                   |  `done`  |
| `Written reflection about the project`                                                                                                                           |  `done`  |
| `Documentation for running the app`                                                                                                                              |  `done`  |


### With Merits

| Feautures                                                                                                                                                        | Status             |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| `Posting a submission while there are pending submission for grading will be rejected`                                                                           |  `done`            |
| `Top bar that display the incremental points accumulated for every correct answer`                                                                               |  `done`            |
| `Additional Playwright test that verifies the score increment for every correct answer`                                                                          |  `done`            |
| `Implementing Redis Stream`                                                                                                                                      |  `not implemented` |
| `Database queries are cached`                                                                                                                                    |  `done`            |
| `Applying Tailwind CSS on UI development`                                                                                                                        |  `done`            |


### Author

Arnel Imperial
