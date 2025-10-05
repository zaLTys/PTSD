import http from "k6/http";
import { check, sleep } from "k6";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export let options = {
  vus: __ENV.VUS || 10,               // Number of virtual users
  duration: __ENV.DURATION || "30s",  // Test duration
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests < 500ms
    http_req_failed: ["rate<0.01"],   // <1% failure rate
  },
};

const BASE_URL = "https://catfact.ninja";

export default function () {
  // 1️⃣ Get a list of facts (paginated)
  let res = http.get(`${BASE_URL}/facts?limit=5`);
  check(res, {
    "GET /facts status 200": (r) => r.status === 200,
  });

  const list = res.json()?.data;
  let factId = null;
  if (Array.isArray(list) && list.length > 0) {
    factId = randomItem(list).id;
  }

  // 2️⃣ Get a random single fact
  res = http.get(`${BASE_URL}/fact`);
  check(res, {
    "GET /fact status 200": (r) => r.status === 200,
  });

  // 3️⃣ Get a fact by ID (if available)
  if (factId) {
    res = http.get(`${BASE_URL}/facts/${factId}`);
    check(res, {
      "GET /facts/{id} status 200": (r) => r.status === 200,
    });
  }

  sleep(1); // wait a bit between iterations
}
