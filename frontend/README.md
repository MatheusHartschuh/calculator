# Frontend

React/Vite frontend for the calculator application. It consumes the Go backend API instead of executing the final arithmetic locally.

The main technical documentation is [`docs/doc-tech.md`](../docs/doc-tech.md).

## Responsibilities

- Render the display, keypad, history, memory, and settings UI.
- Accept mouse and physical keyboard input.
- Coordinate calculator state through `src/hooks/useCalculator.ts`.
- Send calculation requests through `src/services/calculatorApi.ts`.
- Handle API errors and invalid responses predictably.
- Persist language and decimal-place preferences locally.

## Main structure

- `src/App/index.tsx`: visual composition and settings-provider orchestration.
- `src/hooks/useCalculator.ts`: calculator state transitions, API orchestration, history, and memory actions.
- `src/services/calculatorApi.ts`: HTTP client abstraction for the backend.
- `src/lib/number.ts`: number parsing and normalization.
- `src/utils/`: reusable keyboard and display helpers.
- `src/components/`: visual components and their styled-components definitions.
- `src/style/theme.ts`: centralized visual tokens.
- `src/style/global.ts`: global styles that consume the theme.

## Run locally

```bash
npm install
npm start
```

## Environment variable

- `VITE_API_BASE_URL`: points the frontend to a different backend URL during the build.

## Tests and coverage

```bash
npm test
npm run lint
npm run build
npm run coverage
```

Coverage output is generated in `coverage/` when these commands are run from `frontend/`.

## Docker

The frontend can also be run with `docker compose up --build` from the repository root. The production container serves the built assets with Nginx at `http://localhost:3000`.
