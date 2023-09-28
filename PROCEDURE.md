# Overview 

When the user opens up the application, they are shown a name and a handout of a programming assignment, a textarea into which they can write a Python program that solves the problem in the handout, and a button that allows submitting the written program for assessment. After the program is sent for assessment, the user sees updates on the grading status of the program. If the grading finds issues with the program, the user is shown the issues and can adjust their code. Otherwise, the user is notified that they successfully completed the assignment, allowing them to move to the next programming assignment. The next time the user opens up the application, they can continue from the first assignment that they havent't yet completed.

## Requirements
The requirements for completing the project are as follows.

The basic functionality outlined above in Overview is implemented and works for multiple users (test e.g. with incognito mode). The implementations are done with the technologies practiced in this course.

When a programming assignment is submitted, the submission is stored into the database table programming_assignment_submissions. Upon submission, submissions with the same code to the same assignment are looked for from the database table. If a matching entry is found, the values for submission_status, grader_feedback, and correct are copied from the matching submission, and the code is not sent for grading. Otherwise, the submission is sent for grading.

When the submission is sent for grading, information on the submission is added to a queue that is processed one by one. For the passing requirements, it suffices to process one submission at a time (i.e. there is no need for multiple deployments and the service can take ask for a new submission whenever the old one was processed). Once the grading has completed, the values for submission_status, grader_feedback, and correct for the submission are updated.

Regarding the queue, make sure that if there are, say, hundred near-simultaneous submissions, each of them are added to the queue, and they are processed one by one (i.e., there will not be hundred grading processes running in parallel).

When a user has submitted a programming assignment, there is a mechanism in use that allows updating the submission status. The mechanism can be e.g. short polling, long polling, server-sent events, or websockets. The user should not, however, have to refresh the page to see updates. One way to accomplish this is to return a submission identifier to the user upon a submission, and have a separate endpoint that can be used to ping for updates on the submission.

The project has both development and production configuration. The configurations are sensible and serve their purpose.

There are at least three end to end tests written with Playwright. The tests cover (1) creating a submission that fails the tests and checking the feedback on incorrect submission, (2) creating a submission that passes the tests and checking the notification on the correctness of the submission, and (3) creating a submission that passes the tests, checking the notification on the correctness of the submission, moving to the next assignment, and checking that the assignment is a new one. If you have not written tests with Playwright, refer to the Starting with Playwright chapter on the Web Software Development course.

There are performance tests written with k6 that are used for (1) measuring the performance of loading the assignment page and (2) measuring the performance of submitting assignments. The test results are filled in to the PERFORMANCE_TEST_RESULTS.md that is included in the assignment template.

There is a brief description of the application in REFLECTION.md that highlights the key design decisions for the application. The document also contains a reflection of possible improvements that should be done to improve the performance of the application.

Necessary files needed to run the application are present in the submission. The RUNNING.md briefly outlines steps needed to run the application.

## Requirements for passing with merits

In addition to fulfilling all the requirements needed to pass the project, outlined above, passing the project with merits requires the following.

A single user (defined by the user uuid) can have at most one programming assignment submission in grading at a time. If a user with the same user uuid attempts to submit another programming assigment while the previous one is still being graded, the submission is rejected.

The application has a top bar that shows the points for the current user. Each correctly solved programming exercise corresponds to 100 points (solving the same assignment multiple times does not count). Whenever the user completes an assignment, the points are increased by 100. When the user reopens the application, the user is shown the amount of points that corresponds to the users' current progress.

There are additional Playwright tests that verify that the points shown to the user change when the user solves a programming assignment.

There are two deployments of grader-api, both used to process submissions, and the number of deployments can be scaled up without much effort. There is a mechanism in play that seeks to guarantee that the deployments have a balanced amount of work, while also ensuring that grader deployments do not end up processing the same submission. One possibly approach for this would be the use of Redis Streams, but other possibilities may also be considered.

Database query results are cached (when it is meaningful to do so from the performance point of view). As an example, the programming assignments can be stored in a cache either on the server needing them or in a separate Redis cache. Cache purge mechanisms are in place.

The application looks and feels good to use. The application is styled using TailwindCSS, the styles are meaningful, and the styling is consistent.