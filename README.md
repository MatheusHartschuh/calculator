# Calculator

Full-stack calculator application with a React + TypeScript frontend and a Go backend microservice.

The backend is the source of truth for arithmetic operations. The frontend owns the user interface, local history, memory, preferences, and interaction state.

For the complete technical documentation, see [`docs/doc-tech.md`](docs/doc-tech.md).

## Project structure

- `frontend/`: React/Vite application.
- `backend/`: Go REST API and calculation service.
- `docs/`: technical documentation.
- `docker-compose.yml`: local orchestration for both services.
- `package.json`: convenience scripts for the repository.

## Requirements

- Node.js 22+
- npm
- Go 1.22+ when running the backend without Docker
- Docker and Docker Compose when running the complete stack in containers

## Setup

Install the frontend dependencies:

```bash
cd frontend
npm install
```

The backend has no external Go dependencies beyond the module declared in `backend/go.mod`.

## Run the frontend

```bash
cd frontend
npm start
```

The root convenience script can also be used after installing the frontend dependencies:

```bash
npm start
```

The frontend uses `http://localhost:8080` as the default API URL. Set `VITE_API_BASE_URL` during the frontend build to target another API.

## Run the backend

In a second terminal:

```bash
cd backend
go run ./cmd/api
```

Environment variables:

- `ADDR`: complete listen address, for example `:8080`.
- `PORT`: alternative way to provide only the port.
- `CORS_ORIGIN`: value for `Access-Control-Allow-Origin`.

Available endpoints:

- `GET /health`
- `POST /api/calculate`

## Run with Docker

```bash
docker compose up --build
```

The services are then available at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Health check: `http://localhost:8080/health`

The backend image runs `go test ./...` before compiling the API. The frontend image runs `npm test` and `npm run build`, then serves the static application with Nginx.

## API examples

### Health check

```bash
curl http://localhost:8080/health
```

```json
{
  "status": "ok",
  "service": "calculator-api"
}
```

### Addition

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","left":10,"right":5}'
```

```json
{
  "result": 15
}
```

### Square root

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"sqrt","value":9}'
```

```json
{
  "result": 3
}
```

### Percentage

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"percentage","value":25}'
```

```json
{
  "result": 0.25
}
```

### Execution error

```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"divide","left":10,"right":0}'
```

```json
{
  "error": "division by zero"
}
```

Supported operations are `add`, `subtract`, `multiply`, `divide`, `power`, `sqrt`, and `percentage`.

## Tests and coverage

Run frontend tests directly:

```bash
cd frontend
npm test
```

Run backend tests directly:

```bash
cd backend
go test ./...
```

Run the repository test command:

```bash
npm test
```

This runs the frontend suite and validates the backend during the Docker build.

Generate coverage reports for both layers:

```bash
npm run coverage
```

The current validated results are:

- Frontend: 24 tests in 6 files; 86.07% statements/lines, 72.54% branches, and 82.05% functions.
- Backend: 73.9% total statement coverage.

Frontend coverage is generated under `frontend/coverage/`. Backend coverage is generated as `backend/coverage.out` and `backend/coverage.html`.

## Design decisions

- The backend is the source of truth for final arithmetic results.
- The frontend does not reimplement the final mathematical calculation locally.
- The API uses explicit operations instead of a free-form expression parser.
- History and memory are local UI state; they are not sent to the backend.
- Language and decimal-place preferences are persisted in `localStorage`.
- English is the default language, with Brazilian Portuguese available as an explicit option.
- Docker uses separate build/runtime flows for the frontend and backend.
- The final backend image runs as a non-root user.
- The keypad is responsive: below 1024px the workspace becomes a single column, and mobile buttons keep a minimum 44x44px touch area.

## Assumptions

- The backend must be running before using the frontend outside Docker.
- `http://localhost:8080` is the default API URL.
- `http://localhost:3000` is the default Docker Compose frontend URL.
- History and memory do not need to survive a page reload.
- Predictable, testable operations are preferred over a more complex expression parser.

## Documentation

See [`docs/doc-tech.md`](docs/doc-tech.md) for the architecture, API contract, testing strategy, Docker setup, AI-use disclosure, and technical decisions.
