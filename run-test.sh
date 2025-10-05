#!/bin/bash

# Simple k6 test runner
# Usage: ./run-test.sh [test-file] [api-url] [vus] [duration]
# Examples:
#   ./run-test.sh                                    # Default: loadtest.js
#   ./run-test.sh catfactsloadtest.js               # Cat facts API
#   ./run-test.sh loadtest.js http://api:8080 20 60s # Custom params

TEST_FILE=${1:-loadtest.js}
API_URL=${2:-http://localhost:8080}
VUS=${3:-10}
DURATION=${4:-30s}

echo "🚀 Running: tests/$TEST_FILE | $API_URL | ${VUS}VUs | ${DURATION}"

export TEST_FILE API_URL VUS DURATION
docker-compose up --build
