import http from "k6/http";
import { check, sleep } from "k6";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export let options = {
  vus: __ENV.VUS || 10,
  duration: __ENV.DURATION || "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% requests < 500ms
    http_req_failed: ["rate<0.01"],   // <1% failures
  },
};

const BASE_URL = __ENV.API_URL || "http://localhost:8080";

export default function () {
  // Step 1: List all books
  let res = http.get(`${BASE_URL}/books`);
  check(res, { "GET /books status 200": (r) => r.status === 200 });

  // Step 2: Create a new book
  const newBook = {
    author: "Performance Tester",
    title: `Book ${Math.random().toString(36).substring(7)}`,
    pages: Math.floor(Math.random() * 300) + 50,
    color: randomItem(["Red", "Green", "Blue"]),
  };

  res = http.post(`${BASE_URL}/books`, JSON.stringify(newBook), {
    headers: { "Content-Type": "application/json" },
  });

  check(res, { "POST /books status 201": (r) => r.status === 201 });

  const created = res.json();
  const bookId = created?.id;

  // Step 3: Get the newly created book
  if (bookId) {
    res = http.get(`${BASE_URL}/books/${bookId}`);
    check(res, { "GET /books/{id} status 200": (r) => r.status === 200 });
  }

  // Step 4: Update the book (if created)
  if (bookId) {
    const updatedBook = { ...newBook, title: newBook.title + " (updated)" };
    res = http.put(`${BASE_URL}/books/${bookId}`, JSON.stringify(updatedBook), {
      headers: { "Content-Type": "application/json" },
    });
    check(res, { "PUT /books/{id} status 200": (r) => r.status === 200 });
  }

  // Step 5: Delete the book (cleanup)
  if (bookId) {
    res = http.del(`${BASE_URL}/books/${bookId}`);
    check(res, { "DELETE /books/{id} status 200": (r) => r.status === 200 });
  }

  sleep(1); // wait between iterations
}
