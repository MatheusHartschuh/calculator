# Calculator Technical Documentation

This is the main technical record for the project. It documents the current implementation, frontend and backend boundaries, API contract, testing strategy, Docker setup, and architecture decisions.

## Overview

The application is a full-stack calculator with:

- React, TypeScript, and Vite in the frontend.
- Go in the backend.
- HTTP/JSON communication between the two layers.
- a focus on readable, idiomatic, maintainable, and testable code.

The central design decision is that the backend is the source of truth for arithmetic results. The frontend owns interaction state and presentation, but does not reimplement the final mathematical calculation.

## Current project status

The repository currently provides:

- addition, subtraction, multiplication, and division.
- exponentiation, square root, and percentage operations.
- a React UI with mouse and physical keyboard input.
- local history with a clear action.
- local memory with `M+`, `M-`, `MR`, `MC`, recall, and item removal.
- settings for language and decimal places.
- English and Brazilian Portuguese translations.
- responsive layout with mobile touch targets.
- unit, component, API, and HTTP integration tests.
- frontend and backend coverage scripts.
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

- rendering the calculator UI.
- accepting button and physical keyboard input.
- maintaining calculator interaction state.
- displaying local history and memory.
- persisting language and decimal-place preferences.
- calling the backend through an API client.
- presenting localized error states.

### Entry point and composition

- [`../frontend/src/main.tsx`](../frontend/src/main.tsx)
- [`../frontend/src/App/index.tsx`](../frontend/src/App/index.tsx)

`main.tsx` creates the React root, loads the base CSS, and renders the global styled-components stylesheet. `App/index.tsx` is responsible for visual composition, settings state, and the language provider. Calculator behavior is delegated to `useCalculator`.

### Calculator hook

- [`../frontend/src/hooks/useCalculator.ts`](../frontend/src/hooks/useCalculator.ts)

The custom hook owns the interaction state and exposes the actions consumed by the UI:

- `displayValue`: text currently shown in the display.
- `accumulator`: left-hand value of a pending binary operation.
- `pendingOperation`: binary operation waiting for its right-hand value.
- `waitingForOperand`: controls whether the next number replaces the display.
- `history`: successful calculations, limited to the ten most recent entries.
- `memory`: values stored locally.
- `isBusy`: prevents overlapping calculator API requests.
- error state and localized display messages.

The hook also coordinates binary and unary API calls, history updates, memory actions, and keyboard normalization.

### API client

- [`../frontend/src/services/calculatorApi.ts`](../frontend/src/services/calculatorApi.ts)

The API client is the only frontend module that calls `fetch`. It exposes:

- `calculateBinary(operation, left, right)`.
- `calculateUnary(operation, value)`.

`CalculatorApiError` preserves the backend message and HTTP status. Components and hook tests mock this module instead of making real network requests.

The API base URL is read from `VITE_API_BASE_URL`, with `http://localhost:8080` as the local development fallback.

### Frontend types

- [`../frontend/src/types/calculator.ts`](../frontend/src/types/calculator.ts)

The type definitions cover:

- `BinaryOperation`.
- `UnaryOperation`.
- binary and unary request payloads.
- success and error response payloads.

These types keep the client-side API contract explicit.

### Number and display utilities

- [`../frontend/src/lib/number.ts`](../frontend/src/lib/number.ts)
- [`../frontend/src/utils/helper.ts`](../frontend/src/utils/helper.ts)

These utilities handle:

- parsing input strings into finite numbers.
- normalizing numeric strings for calculations and history.
- formatting thousands separators and decimal commas.
- converting error display text through the active i18n messages.

For example, the internal value `12345.67` is displayed as `12.345,67`.

### Memory

- [`../frontend/src/lib/memory.ts`](../frontend/src/lib/memory.ts)
- [`../frontend/src/components/MemoryPanel/index.tsx`](../frontend/src/components/MemoryPanel/index.tsx)

Memory is local UI state stored as an array of numbers. It supports:

- `MC`: clear memory.
- `MR`: recall the last value.
- `M+`: add the current value.
- `M-`: add the opposite of the current value.
- recalling a specific visible item.
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

- language (`en` or `pt-br`).
- default decimal places, normalized between 0 and 12.

Settings are saved in `localStorage`. English is the default language. The document language attribute is updated when the selected language changes.

Translations cover application text, panel titles, settings labels, tooltips, accessibility labels, and calculator error display messages.

### Keyboard normalization

- [`../frontend/src/utils/keyUtils.ts`](../frontend/src/utils/keyUtils.ts)
- [`../frontend/src/utils/tooltipText.ts`](../frontend/src/utils/tooltipText.ts)

Keyboard aliases are normalized before the calculator state machine handles them:

- `Enter` becomes `=`.
- `Backspace` becomes `C`.
- `Escape` becomes `AC`.
- `.` becomes the displayed comma decimal separator.
- `sqrt` and `raiz` become `√`.
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

- desktop: history on the left, calculator in the center, memory on the right.
- below 1024px: one column in the order calculator, history, memory.
- below 640px: reduced spacing and a minimum 44x44px touch area for keypad buttons.
- the `=` button spans three keypad columns below `0`, `,`, and `x²`, with `^` to its right below `√`.

All application colors, gradients, modal colors, global colors, shadows, spacing, typography, and breakpoints are defined in `theme.ts` and consumed by styled-components.

### Frontend Docker image

- [`../frontend/Dockerfile`](../frontend/Dockerfile)
- [`../frontend/nginx.conf`](../frontend/nginx.conf)

The build stage:

1. installs dependencies with `npm ci`.
2. runs `npm test`.
3. runs `npm run build`.

The final stage serves the generated assets with Nginx and supports SPA fallback routing.

## Backend architecture

The backend is responsible for:

- receiving HTTP requests.
- decoding and validating payloads.
- executing arithmetic operations.
- returning JSON responses.
- mapping validation and execution failures to HTTP status codes.

### Entry point

- [`../backend/cmd/api/main.go`](../backend/cmd/api/main.go)

The entry point:

- reads `ADDR` or `PORT`.
- reads `CORS_ORIGIN`.
- creates the calculator service and HTTP server.
- starts `ListenAndServe`.

Defaults:

- `ADDR`: `:8080`.
- `CORS_ORIGIN`: `*`.

### Domain contracts

- [`../backend/internal/domain/calculation.go`](../backend/internal/domain/calculation.go)

The domain package defines the operation values:

- `add`.
- `subtract`.
- `multiply`.
- `divide`.
- `power`.
- `sqrt`.
- `percentage`.

It also defines request, success response, health response, and error response contracts.

### Request validation

- [`../backend/internal/validation/request.go`](../backend/internal/validation/request.go)

Validation rules include:

- unknown JSON fields are rejected.
- trailing data after the first JSON value is rejected.
- `operation` is required.
- binary operations require `left` and `right`.
- unary operations require `value`.

Validation runs before the calculator service is called.

### Calculator service

- [`../backend/internal/calculator/service.go`](../backend/internal/calculator/service.go)

The service contains the arithmetic rules and does not depend on HTTP. It handles:

- addition.
- subtraction.
- multiplication.
- division.
- exponentiation.
- square root.
- percentage.

Execution errors include:

- division by zero.
- square root of a negative number.
- missing operands.
- unsupported operations.
- non-finite results.

The service can be tested directly without starting a server.

### HTTP layer

- [`../backend/internal/http/server.go`](../backend/internal/http/server.go)

The HTTP package owns routes, CORS middleware, JSON encoding, status codes, and error mapping.

Routes:

- `GET /health`.
- `POST /api/calculate`.

Status behavior:

- `400 Bad Request` for malformed/invalid payloads and unsupported or incomplete requests.
- `422 Unprocessable Entity` for mathematical execution errors such as division by zero.
- `405 Method Not Allowed` for an unsupported HTTP method.
- `204 No Content` for CORS preflight requests.

The server intentionally depends on the concrete calculator service for this technical assessment. The HTTP and calculation boundaries are still separated, but no service interface was introduced because that was kept outside the exercise scope.

### CORS

The server sends:

- `Access-Control-Allow-Origin`.
- `Access-Control-Allow-Methods`.
- `Access-Control-Allow-Headers`.
- `Access-Control-Max-Age`.
- `Vary: Origin`.

`CORS_ORIGIN` controls the allowed origin. The default remains `*` for the local technical-assessment setup.

### Backend Docker image

- [`../backend/Dockerfile`](../backend/Dockerfile)

The build stage:

1. uses `golang:1.22-alpine`.
2. copies `go.mod`, `cmd`, `internal`, and `tests`.
3. runs `go test ./...`.
4. builds the API binary.

The final stage copies the binary into `alpine:3.22` and runs it as a non-root user.

## API contract

Full request and response examples are in README.md. Supported operations: add, subtract, multiply, divide, power, sqrt, percentage.

## Testing strategy

### Frontend tests

Frontend tests are located at:

- [`../frontend/src/App/index.test.tsx`](../frontend/src/App/index.test.tsx).
- [`../frontend/src/lib/memory.test.ts`](../frontend/src/lib/memory.test.ts).
- [`../frontend/src/lib/number.test.ts`](../frontend/src/lib/number.test.ts).
- [`../frontend/src/lib/preferences.test.ts`](../frontend/src/lib/preferences.test.ts).
- [`../frontend/src/services/calculatorApi.test.ts`](../frontend/src/services/calculatorApi.test.ts).
- [`../frontend/src/utils/keyUtils.test.ts`](../frontend/src/utils/keyUtils.test.ts).

The component tests cover:

- a complete binary calculation.
- API error display, including English negative-square-root errors.
- adding and displaying history.
- `M+`, `MR`, and `MC` memory flows.
- opening settings and saving decimal places.

The API client is mocked in component tests, so they do not require a running backend.

### Backend tests

Backend tests are located at:

- [`../backend/internal/calculator/service_test.go`](../backend/internal/calculator/service_test.go).
- [`../backend/internal/validation/request_test.go`](../backend/internal/validation/request_test.go).
- [`../backend/tests/api_test.go`](../backend/tests/api_test.go).

They cover arithmetic rules, payload validation, HTTP integration, CORS, success responses, and error status mapping.

### Current coverage

See README.md for the current coverage numbers.

## AI use and prompts

I worked with Codex as the main engineering copilot for this project, running an iterative loop of implement, review and fix rather than accepting the first result. Below are some of the prompts that drove that process, close to how I actually wrote them.

1. "Act as a senior engineer reviewing this repository before a job application submission. Analyze frontend/ and backend/ and answer three questions. Clean design, is any responsibility mixed in the wrong layer, like a React component doing business logic or an HTTP handler calculating directly? Are function and variable names clear? Maintainable code, is any file too large or doing too much? Any hardcoded configuration that should be an environment variable? Testable architecture, is backend business logic isolated enough from HTTP to test without a running server? Be critical, don't just confirm everything is fine, and list real problems from most to least important with file references."

2. "Remove @emotion/react, @emotion/styled and @mui/material from frontend/package.json, they're unused since the project relies on styled-components. Reinstall dependencies and run the build and test suite to confirm nothing breaks."

3. "In backend/internal/http/server.go, check whether the conditional around line 79 always forces a 400 status, even for execution errors that should return 422 per the documented API contract, like division by zero. If that's a real bug, fix it and add a test that asserts the correct status for both cases."

4. "frontend/src/App/index.tsx concentrates calculator state, keyboard handling, API calls, history and memory logic in a single component. Extract that behavior into a custom hook so the App component is left with visual composition only, and confirm the public behavior is unchanged with the full test suite."

5. "Add component tests for the calculator's main flows with Testing Library, covering a complete calculation, an API error being displayed, adding an entry to history, and using M+, MR and MC in the memory panel. Mock calculatorApi.ts instead of making real network calls."

6. "Some error strings are inconsistent with the active language setting, including a hardcoded Portuguese message that shows up even when English is selected. Move all calculator error messages into the existing i18n files so the UI never mixes languages regardless of locale."

7. "The layout uses a fixed three column grid that likely breaks on narrow screens. Add responsive breakpoints so it collapses into a single column below 1024px, with a minimum 44x44px touch target for keypad buttons below 640px, without breaking the existing desktop layout."

8. "Some documentation files describe memory, history and the settings modal as removed or out of scope, but the current code has all three implemented. Treat the code as the source of truth, reconcile every documentation file against it, and remove or rewrite anything that contradicts the current implementation."

Every round of changes was followed by the full test suite before moving on to the next one, and no result was merged without me reading and understanding the change first.

## Possible future improvements

For this technical assessment, the HTTP server intentionally depends on the concrete calculator service, and the default `CORS_ORIGIN` remains `*`. Introducing a small calculator-service interface and requiring a stricter production CORS configuration are conscious out-of-scope improvements that can be revisited if the application grows beyond this exercise.

`npm audit` also reports vulnerabilities in esbuild and vitest's dependency chain, these are devDependencies used only for local development and testing, not part of the shipped runtime, and the available fix requires a breaking vitest upgrade that was intentionally deferred to avoid destabilizing the test suite.

The current model handles operations step by step rather than full expressions like `2 + 3 * 4`, which keeps the API simple but limits input fluidity. A more expression-aware frontend, or a dedicated expression endpoint, would be a natural next step. On the error side, the backend already distinguishes division by zero from a negative square root, but the frontend still collapses both into one generic "Error" state, surfacing that distinction with clearer wording is a quick UX win.

Other possible follow-ups include optional persistence for history and memory, additional frontend state-transition tests, stronger API documentation, and structured backend logging.
