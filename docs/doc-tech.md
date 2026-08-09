# Calculator Technical Documentation

This is the main technical record for the project. It documents the current implementation, frontend and backend boundaries, API contract, testing strategy, Docker setup, and architecture decisions.

## Overview

The application is a full-stack calculator with:

- React, TypeScript, and Vite in the frontend;
- Go in the backend;
- HTTP/JSON communication between the two layers;
- a focus on readable, idiomatic, maintainable, and testable code.

The central design decision is that the backend is the source of truth for arithmetic results. The frontend owns interaction state and presentation, but does not reimplement the final mathematical calculation.

## Current project status

The repository currently provides:

- addition, subtraction, multiplication, and division;
- exponentiation, square root, and percentage operations;
- a React UI with mouse and physical keyboard input;
- local history with a clear action;
- local memory with `M+`, `M-`, `MR`, `MC`, recall, and item removal;
- settings for language and decimal places;
- English and Brazilian Portuguese translations;
- responsive layout with mobile touch targets;
- unit, component, API, and HTTP integration tests;
- frontend and backend coverage scripts;
- separate Dockerfiles and a Docker Compose setup.

## Repository structure

```text
.
├── backend/
├── docs/
├── frontend/
├── docker-compose.yml
├── package.json
└── README.md
```

### `frontend/`

React/Vite application responsible for the visual interface and interaction state.

### `backend/`

Go microservice responsible for request validation and arithmetic execution.

### `docs/`

Project documentation. This file is the main technical reference.

## Frontend architecture

The frontend is responsible for:

- rendering the calculator UI;
- accepting button and physical keyboard input;
- maintaining calculator interaction state;
- displaying local history and memory;
- persisting language and decimal-place preferences;
- calling the backend through an API client;
- presenting localized error states.

### Entry point and composition

- [`../frontend/src/main.tsx`](../frontend/src/main.tsx)
- [`../frontend/src/App/index.tsx`](../frontend/src/App/index.tsx)

`main.tsx` creates the React root, loads the base CSS, and renders the global styled-components stylesheet. `App/index.tsx` is responsible for visual composition, settings state, and the language provider. Calculator behavior is delegated to `useCalculator`.

### Calculator hook

- [`../frontend/src/hooks/useCalculator.ts`](../frontend/src/hooks/useCalculator.ts)

The custom hook owns the interaction state and exposes the actions consumed by the UI:

- `displayValue`: text currently shown in the display;
- `accumulator`: left-hand value of a pending binary operation;
- `pendingOperation`: binary operation waiting for its right-hand value;
- `waitingForOperand`: controls whether the next number replaces the display;
- `history`: successful calculations, limited to the ten most recent entries;
- `memory`: values stored locally;
- `isBusy`: prevents overlapping calculator API requests;
- error state and localized display messages.

The hook also coordinates binary and unary API calls, history updates, memory actions, and keyboard normalization.

### API client

- [`../frontend/src/services/calculatorApi.ts`](../frontend/src/services/calculatorApi.ts)

The API client is the only frontend module that calls `fetch`. It exposes:

- `calculateBinary(operation, left, right)`;
- `calculateUnary(operation, value)`.

`CalculatorApiError` preserves the backend message and HTTP status. Components and hook tests mock this module instead of making real network requests.

The API base URL is read from `VITE_API_BASE_URL`, with `http://localhost:8080` as the local development fallback.

### Frontend types

- [`../frontend/src/types/calculator.ts`](../frontend/src/types/calculator.ts)

The type definitions cover:

- `BinaryOperation`;
- `UnaryOperation`;
- binary and unary request payloads;
- success and error response payloads.

These types keep the client-side API contract explicit.

### Number and display utilities

- [`../frontend/src/lib/number.ts`](../frontend/src/lib/number.ts)
- [`../frontend/src/utils/helper.ts`](../frontend/src/utils/helper.ts)

These utilities handle:

- parsing input strings into finite numbers;
- normalizing numeric strings for calculations and history;
- formatting thousands separators and decimal commas;
- converting error display text through the active i18n messages.

For example, the internal value `12345.67` is displayed as `12.345,67`.

### Memory

- [`../frontend/src/lib/memory.ts`](../frontend/src/lib/memory.ts)
- [`../frontend/src/components/MemoryPanel/index.tsx`](../frontend/src/components/MemoryPanel/index.tsx)

Memory is local UI state stored as an array of numbers. It supports:

- `MC`: clear memory;
- `MR`: recall the last value;
- `M+`: add the current value;
- `M-`: add the opposite of the current value;
- recalling a specific visible item;
- removing an individual item.

Memory is not sent to the backend and is not persisted across page reloads.

### History

- [`../frontend/src/components/HistoryPanel/index.tsx`](../frontend/src/components/HistoryPanel/index.tsx)

History contains only successful calculations and is limited to ten entries. The panel includes an action to clear all entries. History is local UI state and is not sent to the backend or persisted across reloads.

### Settings and internationalization

- [`../frontend/src/lib/preferences.ts`](../frontend/src/lib/preferences.ts)
- [`../frontend/src/components/SettingsModal/index.tsx`](../frontend/src/components/SettingsModal/index.tsx)
- [`../frontend/src/i18n/index.ts`](../frontend/src/i18n/index.ts)
- [`../frontend/src/i18n/en.ts`](../frontend/src/i18n/en.ts)
- [`../frontend/src/i18n/pt-br.ts`](../frontend/src/i18n/pt-br.ts)

The settings modal controls:

- language (`en` or `pt-br`);
- default decimal places, normalized between 0 and 12.

Settings are saved in `localStorage`. English is the default language. The document language attribute is updated when the selected language changes.

Translations cover application text, panel titles, settings labels, tooltips, accessibility labels, and calculator error display messages.

### Keyboard normalization

- [`../frontend/src/utils/keyUtils.ts`](../frontend/src/utils/keyUtils.ts)
- [`../frontend/src/utils/tooltipText.ts`](../frontend/src/utils/tooltipText.ts)

Keyboard aliases are normalized before the calculator state machine handles them:

- `Enter` becomes `=`;
- `Backspace` becomes `C`;
- `Escape` becomes `AC`;
- `.` becomes the displayed comma decimal separator;
- `sqrt` and `raiz` become `√`;
- `x2`, `x^2`, and `^2` become `x²`.

### UI components

- [`../frontend/src/components/Display/index.tsx`](../frontend/src/components/Display/index.tsx): displays the value and captures keyboard input through `onKeyDown`.
- [`../frontend/src/components/Keypad/index.tsx`](../frontend/src/components/Keypad/index.tsx): renders memory, number, action, operator, and function buttons.
- [`../frontend/src/components/Button/index.tsx`](../frontend/src/components/Button/index.tsx): applies semantic button colors, tooltips, and accessibility labels.
- [`../frontend/src/components/HistoryPanel/index.tsx`](../frontend/src/components/HistoryPanel/index.tsx): displays history and the clear action.
- [`../frontend/src/components/MemoryPanel/index.tsx`](../frontend/src/components/MemoryPanel/index.tsx): displays memory values and recall/remove actions.
- [`../frontend/src/components/SettingsModal/index.tsx`](../frontend/src/components/SettingsModal/index.tsx): edits language and decimal-place preferences.

### Layout and styles

- [`../frontend/src/App/style.ts`](../frontend/src/App/style.ts)
- [`../frontend/src/style/theme.ts`](../frontend/src/style/theme.ts)
- [`../frontend/src/style/global.ts`](../frontend/src/style/global.ts)
- [`../frontend/src/index.css`](../frontend/src/index.css)

The layout behavior is:

- desktop: history on the left, calculator in the center, memory on the right;
- below 1024px: one column in the order calculator, history, memory;
- below 640px: reduced spacing and a minimum 44x44px touch area for keypad buttons;
- the `=` button spans three keypad columns below `0`, `,`, and `x²`, with `^` to its right below `√`.

All application colors, gradients, modal colors, global colors, shadows, spacing, typography, and breakpoints are defined in `theme.ts` and consumed by styled-components.

### Frontend Docker image

- [`../frontend/Dockerfile`](../frontend/Dockerfile)
- [`../frontend/nginx.conf`](../frontend/nginx.conf)

The build stage:

1. installs dependencies with `npm ci`;
2. runs `npm test`;
3. runs `npm run build`.

The final stage serves the generated assets with Nginx and supports SPA fallback routing.

## Backend architecture

The backend is responsible for:

- receiving HTTP requests;
- decoding and validating payloads;
- executing arithmetic operations;
- returning JSON responses;
- mapping validation and execution failures to HTTP status codes.

### Entry point

- [`../backend/cmd/api/main.go`](../backend/cmd/api/main.go)

The entry point:

- reads `ADDR` or `PORT`;
- reads `CORS_ORIGIN`;
- creates the calculator service and HTTP server;
- starts `ListenAndServe`.

Defaults:

- `ADDR`: `:8080`;
- `CORS_ORIGIN`: `*`.

### Domain contracts

- [`../backend/internal/domain/calculation.go`](../backend/internal/domain/calculation.go)

The domain package defines the operation values:

- `add`;
- `subtract`;
- `multiply`;
- `divide`;
- `power`;
- `sqrt`;
- `percentage`.

It also defines request, success response, health response, and error response contracts.

### Request validation

- [`../backend/internal/validation/request.go`](../backend/internal/validation/request.go)

Validation rules include:

- unknown JSON fields are rejected;
- trailing data after the first JSON value is rejected;
- `operation` is required;
- binary operations require `left` and `right`;
- unary operations require `value`.

Validation runs before the calculator service is called.

### Calculator service

- [`../backend/internal/calculator/service.go`](../backend/internal/calculator/service.go)

The service contains the arithmetic rules and does not depend on HTTP. It handles:

- addition;
- subtraction;
- multiplication;
- division;
- exponentiation;
- square root;
- percentage.

Execution errors include:

- division by zero;
- square root of a negative number;
- missing operands;
- unsupported operations;
- non-finite results.

The service can be tested directly without starting a server.

### HTTP layer

- [`../backend/internal/http/server.go`](../backend/internal/http/server.go)

The HTTP package owns routes, CORS middleware, JSON encoding, status codes, and error mapping.

Routes:

- `GET /health`;
- `POST /api/calculate`.

Status behavior:

- `400 Bad Request` for malformed/invalid payloads and unsupported or incomplete requests;
- `422 Unprocessable Entity` for mathematical execution errors such as division by zero;
- `405 Method Not Allowed` for an unsupported HTTP method;
- `204 No Content` for CORS preflight requests.

The server intentionally depends on the concrete calculator service for this technical assessment. The HTTP and calculation boundaries are still separated, but no service interface was introduced because that was kept outside the exercise scope.

### CORS

The server sends:

- `Access-Control-Allow-Origin`;
- `Access-Control-Allow-Methods`;
- `Access-Control-Allow-Headers`;
- `Access-Control-Max-Age`;
- `Vary: Origin`.

`CORS_ORIGIN` controls the allowed origin. The default remains `*` for the local technical-assessment setup.

### Backend Docker image

- [`../backend/Dockerfile`](../backend/Dockerfile)

The build stage:

1. uses `golang:1.22-alpine`;
2. copies `go.mod`, `cmd`, `internal`, and `tests`;
3. runs `go test ./...`;
4. builds the API binary.

The final stage copies the binary into `alpine:3.22` and runs it as a non-root user.

## API contract

### Health check

`GET /health`

Response:

```json
{
  "status": "ok",
  "service": "calculator-api"
}
```

### Binary calculation

`POST /api/calculate`

Request:

```json
{
  "operation": "add",
  "left": 10,
  "right": 5
}
```

Response:

```json
{
  "result": 15
}
```

Binary operations are `add`, `subtract`, `multiply`, `divide`, and `power`.

### Unary calculation

Square root:

```json
{
  "operation": "sqrt",
  "value": 9
}
```

Percentage:

```json
{
  "operation": "percentage",
  "value": 25
}
```

The corresponding results are `3` and `0.25`.

### Error responses

Division by zero:

```json
{
  "error": "division by zero"
}
```

Missing operand:

```json
{
  "error": "value is required for this operation"
}
```

Invalid JSON:

```json
{
  "error": "invalid JSON payload: unexpected EOF"
}
```

## End-to-end examples

### Addition

1. The user enters `1`, `+`, `2`, and `=`.
2. The frontend keeps the current input in local state.
3. The API client sends `POST /api/calculate`.
4. The backend calculates `1 + 2`.
5. The JSON result returns to the frontend.
6. The display and local history are updated.

### Square root

1. The user enters a number and selects `√`.
2. The frontend sends a unary `sqrt` operation.
3. The backend validates and executes the operation.
4. The result is returned as JSON and displayed.

### Percentage

1. The user selects `%`.
2. The frontend sends the current value as `value`.
3. The backend divides it by `100`.
4. The formatted result is displayed and added to history.

## Testing strategy

### Frontend tests

Frontend tests are located at:

- [`../frontend/src/App/index.test.tsx`](../frontend/src/App/index.test.tsx);
- [`../frontend/src/lib/memory.test.ts`](../frontend/src/lib/memory.test.ts);
- [`../frontend/src/lib/number.test.ts`](../frontend/src/lib/number.test.ts);
- [`../frontend/src/lib/preferences.test.ts`](../frontend/src/lib/preferences.test.ts);
- [`../frontend/src/services/calculatorApi.test.ts`](../frontend/src/services/calculatorApi.test.ts);
- [`../frontend/src/utils/keyUtils.test.ts`](../frontend/src/utils/keyUtils.test.ts).

The component tests cover:

- a complete binary calculation;
- API error display, including English negative-square-root errors;
- adding and displaying history;
- `M+`, `MR`, and `MC` memory flows;
- opening settings and saving decimal places.

The API client is mocked in component tests, so they do not require a running backend.

### Backend tests

Backend tests are located at:

- [`../backend/internal/calculator/service_test.go`](../backend/internal/calculator/service_test.go);
- [`../backend/internal/validation/request_test.go`](../backend/internal/validation/request_test.go);
- [`../backend/tests/api_test.go`](../backend/tests/api_test.go).

They cover arithmetic rules, payload validation, HTTP integration, CORS, success responses, and error status mapping.

### Current coverage

Latest validated results:

- Frontend: 24 tests in 6 files; 86.07% statements/lines, 72.54% branches, and 82.05% functions.
- Backend: 73.9% total statement coverage.

Generate the reports with:

```bash
npm run coverage
```

This creates frontend output under `frontend/coverage/` and backend reports at `backend/coverage.out` and `backend/coverage.html`.

## Local setup and Docker

### Requirements

- Node.js 22+;
- npm;
- Go 1.22+ for running the backend without Docker;
- Docker and Docker Compose for the complete containerized stack.

### Local commands

```bash
cd frontend
npm install
npm start
```

In a second terminal:

```bash
cd backend
go run ./cmd/api
```

The frontend defaults to `http://localhost:8080` for the API.

### Docker Compose

- [`../docker-compose.yml`](../docker-compose.yml)

Run:

```bash
docker compose up --build
```

The Compose configuration exposes:

- backend at `http://localhost:8080`;
- frontend at `http://localhost:3000`.

It passes `CORS_ORIGIN=http://localhost:3000` to the backend and `VITE_API_BASE_URL=http://localhost:8080` to the frontend build.

### Root convenience scripts

The root `package.json` orchestrates common commands:

- `npm start`: starts the frontend;
- `npm run dev`: starts the frontend in development mode;
- `npm run build`: builds the frontend;
- `npm run lint`: lints the frontend;
- `npm test`: runs frontend tests and builds the backend image, which runs backend tests;
- `npm run coverage`: generates frontend and backend coverage reports.

## Design decisions and assumptions

- The backend is the source of truth for arithmetic results.
- The frontend does not calculate final results locally.
- The API uses explicit operations rather than a general expression parser.
- History and memory are local UI state.
- UI preferences are persisted in `localStorage`.
- English is the default language and `pt-br` is an explicit option.
- The default API URL is `http://localhost:8080`.
- History and memory do not need to survive page reloads.
- The Docker backend runs as a non-root user.
- The frontend and backend are built as separate images.

## AI use and prompts

This project was developed with generative AI assistance in this session, using Codex as an engineering copilot. The final implementation and decisions were checked against the project objective and requirements.

AI assistance was used for repository inspection, backend and frontend implementation, refactoring, tests, responsive styling, documentation, Docker configuration, and review of the resulting code.

Representative prompts and instructions used during the work included:

- review `frontend/` and `backend/` as a senior engineer for clean design, maintainability, and testability;
- remove unused frontend dependencies and validate with install, build, and tests;
- investigate HTTP status mapping for validation and mathematical execution errors;
- extract calculator behavior from the App shell into a custom hook;
- add component tests with Testing Library while mocking `calculatorApi.ts`;
- move calculator error messages into the English and Portuguese i18n files;
- improve mobile layout, touch targets, keypad placement, and responsive breakpoints;
- compare the documentation with the current code and remove contradictions;
- run the complete frontend and backend validation suite before delivery.

These are summaries of the iterative task prompts used in the conversation; no external AI service was used as a source of truth for the product.

## Possible future improvements

For this technical assessment, the HTTP server intentionally depends on the concrete calculator service, and the default `CORS_ORIGIN` remains `*`. Introducing a small calculator-service interface and requiring a stricter production CORS configuration are conscious out-of-scope improvements that can be revisited if the application grows beyond this exercise.

Other possible follow-ups include optional persistence for history and memory, additional frontend state-transition tests, stronger API documentation, and structured backend logging.
