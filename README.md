# PTSD (Performance testing sandbox + docker)
### 🚀 k6, InfluxDB & Grafana

A complete performance testing setup using k6 for load testing, InfluxDB for metrics storage, and Grafana for visualization.

<img width="400" height="240" alt="image" src="https://github.com/user-attachments/assets/77b1d63a-b69a-4423-a0a1-9f2f98086a5a" />
<img width="470" height="240" alt="image" src="https://github.com/user-attachments/assets/ba21faa5-edf1-4e16-ad4b-6225a2f2eafe" />


## 📁 Repository Structure

```
PerformanceTesting/
├── docker-compose.yml          # Main orchestration file
├── run-test.sh                 # Simple test runner script
├── tests/                      # k6 test scenarios
│   ├── loadtest.js            # Books API CRUD test
│   └── catfactsloadtest.js    # Cat Facts API read-only test
└── provisioning/              # Grafana configuration
    ├── dashboards/
    │   ├── dashboards.yaml    # Dashboard provisioning config
    │   └── k6-dashboard.json  # k6 performance dashboard
    └── datasources/
        └── datasource.yaml    # InfluxDB datasource config
```

## 🛠️ Tech Stack

- **k6** - Load testing tool
- **InfluxDB 1.8** - Time-series database for metrics
- **Grafana** - Metrics visualization and monitoring
- **Docker Compose** - Container orchestration

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- No additional setup required!

### Running Tests

#### Option 1: Simple Script (Recommended)
```bash
# Default test (Books API)
./run-test.sh

# Cat Facts API test
./run-test.sh catfactsloadtest.js

# Custom parameters: [test-file] [api-url] [vus] [duration]
./run-test.sh loadtest.js http://api:8080 20 60s
```

#### Option 2: Docker Compose Direct
```bash
# Default test
docker-compose up

# Custom test file
TEST_FILE=catfactsloadtest.js docker-compose up

# Full customization
TEST_FILE=loadtest.js API_URL=http://api:8080 VUS=20 DURATION=60s docker-compose up
```

## 📊 Available Test Scenarios

### 📚 Books API Test (`loadtest.js`)
- **Purpose**: Full CRUD operations testing
- **API**: `http://localhost:8080` (configurable)
- **Operations**:
  - GET `/books` - List all books
  - POST `/books` - Create new book
  - GET `/books/{id}` - Get specific book
  - PUT `/books/{id}` - Update book
  - DELETE `/books/{id}` - Delete book
- **Data**: Random books with author, title, pages, color

### 🐱 Cat Facts API Test (`catfactsloadtest.js`)
- **Purpose**: Read-only API testing
- **API**: `https://catfact.ninja` (public API)
- **Operations**:
  - GET `/facts` - List facts (paginated)
  - GET `/fact` - Get random fact
  - GET `/facts/{id}` - Get specific fact
- **Data**: Real cat facts from public API

## 📈 Monitoring & Visualization

### Grafana Dashboard
- **URL**: http://localhost:3000
- **Login**: admin / admin
- **Dashboard**: "k6 Load Testing Results"

### Metrics Tracked
- **Virtual Users**: Active concurrent users
- **Requests per Second**: Throughput
- **Response Times**: p50, p90, p95, p99
- **Error Rates**: Failed request percentage
- **HTTP Status Codes**: Success/failure distribution

### InfluxDB
- **URL**: http://localhost:8086
- **Database**: k6
- **Credentials**: k6 / k6pass

## ⚙️ Configuration

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `TEST_FILE` | `loadtest.js` | k6 test file to run |
| `API_URL` | `http://localhost:8080` | Target API URL |
| `VUS` | `10` | Number of virtual users |
| `DURATION` | `30s` | Test duration |

### Test Configuration
Each test file supports these k6 options:
```javascript
export let options = {
  vus: __ENV.VUS || 10,               // Virtual users
  duration: __ENV.DURATION || "30s",  // Test duration
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% requests < 500ms
    http_req_failed: ["rate<0.01"],   // <1% failure rate
  },
};
```

## 🔧 Customization

### Adding New Tests
1. Create new `.js` file in `tests/` directory
2. Follow k6 syntax and import patterns
3. Use environment variables for configuration
4. Run with: `./run-test.sh your-test.js`

### Modifying Dashboard
1. Edit `provisioning/dashboards/k6-dashboard.json`
2. Restart Grafana: `docker-compose restart grafana`
3. Changes will be applied automatically

### Changing Data Source
1. Update `provisioning/datasources/datasource.yaml`
2. Modify connection details as needed
3. Restart Grafana to apply changes

## 📋 Common Commands

```bash
# Start all services
docker-compose up -d

# Run specific test
./run-test.sh catfactsloadtest.js

# View logs
docker-compose logs k6
docker-compose logs grafana

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build
```

## 🎯 Use Cases

- **API Performance Testing**: Test your REST APIs under load
- **Load Testing**: Determine system capacity and bottlenecks
- **Monitoring Setup**: Real-time metrics visualization
- **CI/CD Integration**: Automated performance testing
- **Public API Testing**: Test external APIs safely

## 📚 Resources

- [k6 Documentation](https://k6.io/docs/)
- [InfluxDB Documentation](https://docs.influxdata.com/influxdb/v1.8/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Add new test scenarios in `tests/` directory
2. Follow existing naming conventions
3. Update this README if adding new features
4. Test your changes before submitting

---

**Happy Performance Testing!** 🚀📊
