# Playwright UI + API Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-v1.58-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

This repository is a unified Playwright + TypeScript automation framework for:

- UI automation
- API automation
- hybrid UI + API business flows

The framework is built to keep one consistent engineering model across all three layers instead of maintaining separate UI and API repositories.

It is designed around:

- Playwright test execution
- Page Object Model for UI workflows
- service-layer abstraction for API workflows
- fixture-based dependency injection
- reusable helper layers for actions, waits, assertions, logging, and reporting
- Zod-based API contract validation
- HTML, JSON, JUnit, and Allure reporting
- hybrid test journeys that combine API setup with UI verification

## Read This First

For the full internal design, usage model, extension guidance, and beginner-friendly layer-by-layer explanation, read:

- [Framework Handbook](/Users/rajesh.yemul/Practice%20Project/pw-ui-api-framework/docs/framework-architecture.md)

Use this `README.md` for setup, daily usage, and repository navigation.

## Current Application Under Test

The framework currently uses `Restful-Booker-Platform` as the reference application:

- UI: `https://automationintesting.online`
- API: `https://automationintesting.online/api`

This application is a good fit for the merged framework because it exposes:

- public UI pages
- authenticated admin API operations
- public booking creation flows
- data that can be created by API and verified in UI

## Framework Philosophy

The intended usage model is:

- tests orchestrate workflows
- fixtures inject typed dependencies
- page objects own UI behavior
- services own API behavior
- helper classes own low-level mechanics
- reporting and observability run automatically through framework hooks

For day-to-day usage:

- use `@fixtures/UiFixture` for UI-only tests
- use `@fixtures/ApiFixture` for API-only tests
- use `@fixtures/AppFixture` for hybrid UI + API flows

The current convention is:

- page objects call helper classes for actions, waits, and assertions
- tests use fixture-injected helpers such as `assertUtils` instead of importing raw Playwright `expect` for plain-value checks

## Repository Structure

```text
playwright-ui-api-framework/
├── docs/
│   └── framework-architecture.md   # Full framework handbook
├── src/
│   ├── assertions/                 # API response and schema assertions
│   ├── config/                     # Shared config and lifecycle hooks
│   ├── contracts/                  # Zod runtime contracts
│   ├── core/                       # Shared logger, API client, auth manager
│   ├── fixtures/                   # uiTest, apiTest, appTest
│   ├── helper/                     # Actions, waits, asserts, logging, reporting
│   ├── models/                     # Contract-derived type exports
│   ├── observability/              # Metrics and failure analysis
│   ├── pages/                      # Page objects
│   ├── runner/                     # Ordered execution support
│   ├── services/                   # Domain services
│   ├── support/                    # Constants, enums, and locator definitions
│   ├── test-data/                  # Factories and cleanup support
│   └── utils/                      # Shared utilities
├── tests/
│   ├── ui/                         # UI suites
│   ├── api/                        # API suites
│   └── app/                        # Hybrid UI + API suites
├── .env.example                    # Local runtime configuration template
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Scripts and dependencies
├── playwright.config.ts            # Unified Playwright configuration
├── README.md                       # Setup and usage guide
└── tsconfig.json                   # TypeScript config and path aliases
```

## Prerequisites

- Node.js 18+
- npm
- Playwright browser binaries
- Java runtime for Allure report generation

## Installation

```bash
npm install
cp .env.example .env
npx playwright install
```

## Environment Configuration

The framework is configured through `.env`.

Important values:

- `ENVIRONMENT=dev|qa|stage|prod|local`
- `BROWSER=chromium|firefox|webkit`
- `HEADLESS=true|false`
- `RETRIES=0|1|2`
- `WORKERS=1|2|...`
- `TEST_TIMEOUT=60000`
- `UI_BASE_URL=https://automationintesting.online`
- `API_BASE_URL=https://automationintesting.online/api`
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=password`
- `API_TIMEOUT=30000`
- `LOG_LEVEL=debug|info|warn|error`
- `CI=true|false`

`TEST_TIMEOUT` is especially important for this sample project because the public demo environment can be slow, especially on authenticated API calls. The framework default is intentionally more forgiving than Playwright's default timeout so setup, cleanup, and slower external calls do not create false failures.

Example:

```bash
ENVIRONMENT=qa
BROWSER=chromium
HEADLESS=false
RETRIES=0
WORKERS=
CI=false
CI_WORKERS=1
TEST_TIMEOUT=60000
LOG_LEVEL=info
DEBUG=false

UI_BASE_URL=https://automationintesting.online
API_BASE_URL=https://automationintesting.online/api

ADMIN_USERNAME=admin
ADMIN_PASSWORD=password

API_TIMEOUT=30000
REPORT_ROOT=
```

## Main Commands

```bash
# Full run
npm test

# Run UI suites
npm run test:ui

# Run API suites
npm run test:api

# Run hybrid UI + API suites
npm run test:app

# Run smoke tests across the framework
npm run test:smoke

# Run integration-tagged tests
npm run test:integration

# Run ordered execution
npm run test:ordered

# Run in headed mode
npm run test:headed

# Run in debug mode
npm run test:debug

# Type-check the repository
npm run type-check

# Lint the repository
npm run lint

# Run the standard quality gate
npm run validate

# Format the repository
npm run format

# Generate HTML report
npm run report:html

# Generate and open Allure report
npm run report:allure
```

## Test Organization

The framework uses three top-level test areas:

### `tests/ui`

Use this area for browser-only scenarios.

Examples:

- landing page validation
- page content validation
- navigation and interaction workflows

### `tests/api`

Use this area for service/API scenarios.

Examples:

- authentication smoke
- room and booking service validation
- contract and integration coverage

### `tests/app`

Use this area for hybrid flows that intentionally combine API and UI.

Examples:

- create test data by API, verify in UI
- perform UI flow, verify backend state by API

## Current Sample Coverage

The framework currently contains:

- UI smoke
  - public room catalog validation
- API smoke
  - admin authentication validation
  - public room catalog validation
  - public room endpoint health validation
- API integration
  - booking creation and secured summary verification
- Hybrid app flow
  - room creation by API and verification in the public UI
  - public API room data compared with the visible public UI catalog

## Runtime Flow

At a high level:

1. `playwright.config.ts` loads the unified runtime configuration and reporting configuration.
2. Global setup clears the metrics buffer for a clean run.
3. Tests import `uiTest`, `apiTest`, or `appTest` depending on the scenario type.
4. Fixtures inject page objects, services, request clients, and cleanup support.
5. `PageSetup.ts` captures failure artifacts for UI-enabled runs.
6. API requests are logged and measured through `ApiClient` and `MetricsCollector`.
7. Reports are written to timestamped folders under `reports/`.
8. Global teardown prints API metrics and failure diagnostics.

## Reporting

Each run writes artifacts under a timestamped folder in `reports/`.

Outputs include:

- Playwright HTML report
- JSON report
- JUnit report
- Allure results
- traces, screenshots, and videos on failure
- framework log files
- API metrics buffer and teardown summary

## Extending the Framework

When adding new business coverage:

- add or extend page objects under `src/pages`
- add or extend contracts under `src/contracts`
- add or extend services under `src/services`
- add data factories under `src/test-data`
- wire new dependencies through fixtures only when tests genuinely need them
- keep tests focused on workflows, not low-level mechanics

## Notes

- The framework structure, documentation, and sample execution flows are in place.
- The repository has been type-checked and verified with a full Playwright execution pass.
