# Backend

Go microservice responsible for validation and arithmetic calculations.

The main technical documentation is [`docs/doc-tech.md`](../docs/doc-tech.md).

## Structure

- `cmd/api`: application entry point.
- `internal/calculator`: arithmetic rules and domain errors.
- `internal/domain`: API contracts and operation definitions.
- `internal/http`: routes, handlers, CORS, status codes, and JSON responses.
- `internal/validation`: request decoding and validation.
- `tests`: HTTP integration and contract tests.

The backend is the source of truth for the calculations exposed by the API. The frontend consumes this API and does not contain the final arithmetic implementation.

## Run locally

```bash
go run ./cmd/api
```

Environment variables:

- `ADDR`: complete listen address, for example `:8080`.
- `PORT`: alternative way to provide only the port.
- `CORS_ORIGIN`: value for `Access-Control-Allow-Origin`.

## Docker

Run `docker compose up --build` from the repository root. The backend image runs `go test ./...` before compiling the API and exposes port `8080`.

## Tests and coverage

```bash
go test ./...
```

From the repository root, generate the backend coverage report with:

```bash
npm run coverage:backend
```

This runs the tests inside a Go container and generates `backend/coverage.out` and `backend/coverage.html`.

## Endpoints

- `GET /health`
- `POST /api/calculate`
