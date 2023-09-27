# Reflection

Reflection based on the results gather in PERFORMANCE_TEST_RESULTS.

The app with and without Redis caching has the same result for retrieving assignments from database. While the application without caching for adding submission, has higher request rate and faster request duration compared to cached application. Both of the test has 99 virtual users and no failed requests.

The primary strategy used to increase the project's scalability is the implementation of Redis caching for all database queries.
