# Performance test results

Description of the used server: HTTP/1.1

Description of local machine used: MacBook Pro, Processor: 2,2 GHz 6-Core Intel Core i7, Memory: 16 GB 2400 MHz DDR4

## No Caching

### Retrieving assignments

http_reqs: 11300

http_req_duration - median: 87.68ms

http_req_duration - 99th percentile: 171.83ms

### Posting submission

http_reqs: 1153

http_req_duration - median: 913.47ms

http_req_duration - 99th percentile: 2s

## With Redis Caching

### Retrieving assignments

http_reqs: 11300

http_req_duration - median: 87.68ms

http_req_duration - 99th percentile: 171.83ms

### Posting submission

http_reqs: 891

http_req_duration - median: 1.24s

http_req_duration - 99th percentile: 2.21s

### Details

#### Retrieving assignments

```bash
# with Redis caching
execution: local
     script: performance-test-load-assignments.js
     output: -

  scenarios: (100.00%) 1 scenario, 99 max VUs, 40s max duration (incl. graceful stop):
           * default: 99 looping VUs for 10s (gracefulStop: 30s)


     data_received..................: 19 MB  1.8 MB/s
     data_sent......................: 1.1 MB 107 kB/s
     http_req_blocked...............: avg=42.03µs p(99)=47µs
     http_req_connecting............: avg=26.85µs p(99)=0s
     http_req_duration..............: avg=87.68ms p(99)=171.83ms
       { expected_response:true }...: avg=87.68ms p(99)=171.83ms
     http_req_failed................: 0.00%  ✓ 0           ✗ 11300
     http_req_receiving.............: avg=66.76µs p(99)=161µs
     http_req_sending...............: avg=19.81µs p(99)=71µs
     http_req_tls_handshaking.......: avg=0s      p(99)=0s
     http_req_waiting...............: avg=87.6ms  p(99)=171.59ms
     http_reqs......................: 11300  1123.877453/s
     iteration_duration.............: avg=87.81ms p(99)=171.99ms
     iterations.....................: 11300  1123.877453/s
     vus............................: 99     min=99        max=99
     vus_max........................: 99     min=99        max=99


running (10.1s), 00/99 VUs, 11300 complete and 0 interrupted iterations

```

```bash
# without Redis caching
 execution: local
     script: performance-test-load-assignments.js
     output: -

  scenarios: (100.00%) 1 scenario, 99 max VUs, 40s max duration (incl. graceful stop):
           * default: 99 looping VUs for 10s (gracefulStop: 30s)


     data_received..................: 19 MB  1.8 MB/s
     data_sent......................: 1.1 MB 107 kB/s
     http_req_blocked...............: avg=42.03µs p(99)=47µs
     http_req_connecting............: avg=26.85µs p(99)=0s
     http_req_duration..............: avg=87.68ms p(99)=171.83ms
       { expected_response:true }...: avg=87.68ms p(99)=171.83ms
     http_req_failed................: 0.00%  ✓ 0           ✗ 11300
     http_req_receiving.............: avg=66.76µs p(99)=161µs
     http_req_sending...............: avg=19.81µs p(99)=71µs
     http_req_tls_handshaking.......: avg=0s      p(99)=0s
     http_req_waiting...............: avg=87.6ms  p(99)=171.59ms
     http_reqs......................: 11300  1123.877453/s
     iteration_duration.............: avg=87.81ms p(99)=171.99ms
     iterations.....................: 11300  1123.877453/s
     vus............................: 99     min=99        max=99
     vus_max........................: 99     min=99        max=99


running (10.1s), 00/99 VUs, 11300 complete and 0 interrupted iterations
```

#### Posting submission

```bash
# with Redis caching
execution: local
     script: performance-test-add-submission.js
     output: -

  scenarios: (100.00%) 1 scenario, 99 max VUs, 40s max duration (incl. graceful stop):
           * default: 99 looping VUs for 10s (gracefulStop: 30s)


     data_received..................: 368 kB 33 kB/s
     data_sent......................: 219 kB 19 kB/s
     http_req_blocked...............: avg=472.98µs p(99)=5.14ms
     http_req_connecting............: avg=300.5µs  p(99)=3.1ms
     http_req_duration..............: avg=1.24s    p(99)=2.21s
       { expected_response:true }...: avg=1.24s    p(99)=2.21s
     http_req_failed................: 0.00%  ✓ 0        ✗ 891
     http_req_receiving.............: avg=70.42µs  p(99)=166.1µs
     http_req_sending...............: avg=46.41µs  p(99)=501.5µs
     http_req_tls_handshaking.......: avg=0s       p(99)=0s
     http_req_waiting...............: avg=1.24s    p(99)=2.21s
     http_reqs......................: 891    78.94939/s
     iteration_duration.............: avg=1.24s    p(99)=2.21s
     iterations.....................: 891    78.94939/s
     vus............................: 99     min=99     max=99
     vus_max........................: 99     min=99     max=99


running (11.3s), 00/99 VUs, 891 complete and 0 interrupted iterations

```

```bash
# without Redis caching
 execution: local
     script: performance-test-add-submission.js
     output: -

  scenarios: (100.00%) 1 scenario, 99 max VUs, 40s max duration (incl. graceful stop):
           * default: 99 looping VUs for 10s (gracefulStop: 30s)


     data_received..................: 476 kB 42 kB/s
     data_sent......................: 284 kB 25 kB/s
     http_req_blocked...............: avg=349.44µs p(99)=4.9ms
     http_req_connecting............: avg=242.52µs p(99)=3.68ms
     http_req_duration..............: avg=913.47ms p(99)=2s
       { expected_response:true }...: avg=913.47ms p(99)=2s
     http_req_failed................: 0.00%  ✓ 0          ✗ 1153
     http_req_receiving.............: avg=67.15µs  p(99)=155.44µs
     http_req_sending...............: avg=38.05µs  p(99)=446.32µs
     http_req_tls_handshaking.......: avg=0s       p(99)=0s
     http_req_waiting...............: avg=913.36ms p(99)=2s
     http_reqs......................: 1153   102.721212/s
     iteration_duration.............: avg=913.95ms p(99)=2s
     iterations.....................: 1153   102.721212/s
     vus............................: 22     min=22       max=99
     vus_max........................: 99     min=99       max=99


running (11.2s), 00/99 VUs, 1153 complete and 0 interrupted iterations


```
