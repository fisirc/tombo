import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "15s", target: 1000 }, // Ramp-up to 1000 users in 15s
    { duration: "15s", target: 1000 },  // Stay at 1000 users for 1 minute
    { duration: "15s", target: 0 }    // Ramp-down to 0 users in 15s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% requests should fail
  },
};

export default function () {
  let payload = JSON.stringify({
    "reportId": "dbf0054c-700b-40fc-a00c-10bc4b94cbbc",
    "message": `This is a comment test ${Math.random()}` // Unique message per request
  });

  let res = http.post(
    "https://reports.tombo.paoloose.site/api/comments/",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(res, {
    "status was 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(0.5); // Reduce sleep time to increase concurrency
}
