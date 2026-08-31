---
applyTo: '**/*.spec.ts'
---

# Unit Testing Guidelines

Unit tests in this repo follow the **SIFERS** pattern (Simple Injectable Functions Explicitly Returning State).

<!-- For background on the SIFERS pattern: https://medium.com/@kolodny/testing-with-sifers-c9d6bb5b362 -->

## Core Rule

Every test suite must use a single `setup()` function to initialize state. Do **not** use `beforeEach` with shared mutable variables declared in the `describe` scope.

## Why

- Each test gets a fresh, isolated state — no leakage between tests
- Setup logic is explicit and easy to step through when debugging
- Injectable parameters make per-test overrides clean and type-safe
- No need to redeclare variables outside `beforeEach` just to access them in tests

## Good Example ✅

```ts
import { describe, it, expect, vi } from 'vitest';
import { formatGreeting } from './greet';

describe('formatGreeting', () => {
  function setup({ name = 'World' } = {}) {
    const logger = { log: vi.fn() };
    const result = formatGreeting(name, logger);
    return { result, logger };
  }

  it('returns a greeting for the default name', () => {
    const { result } = setup();
    expect(result).toBe('Hello, World!');
  });

  it('returns a greeting for a custom name', () => {
    const { result } = setup({ name: 'Ada' });
    expect(result).toBe('Hello, Ada!');
  });

  it('logs the greeting', () => {
    const { logger } = setup({ name: 'Ada' });
    expect(logger.log).toHaveBeenCalledWith('Hello, Ada!');
  });
});
```

## Good Example with Async/Await ✅

When setup involves asynchronous work, make `setup()` an `async` function and `await` it in each test. The pattern is identical — no `beforeEach` needed.

```ts
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './user-service';

describe('fetchUser', () => {
  async function setup({ userId = '1' } = {}) {
    const httpClient = { get: vi.fn().mockResolvedValue({ id: userId, name: 'Ada' }) };
    const user = await fetchUser(userId, httpClient);
    return { user, httpClient };
  }

  it('returns the user for the given id', async () => {
    const { user } = await setup();
    expect(user).toEqual({ id: '1', name: 'Ada' });
  });

  it('calls the http client with the correct url', async () => {
    const { httpClient } = await setup({ userId: '42' });
    expect(httpClient.get).toHaveBeenCalledWith('/users/42');
  });
});
```

## Bad Example (Anti-Pattern) ❌

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatGreeting } from './greet';

describe('formatGreeting', () => {
  // Shared mutable state — tests can inadvertently affect each other
  let logger: { log: ReturnType<typeof vi.fn> };
  let result: string;

  beforeEach(() => {
    logger = { log: vi.fn() };
    result = formatGreeting('World', logger);
  });

  it('returns a greeting for the default name', () => {
    expect(result).toBe('Hello, World!');
  });

  it('returns a greeting for a custom name', () => {
    // Forces re-running setup inline — defeats the purpose of beforeEach
    result = formatGreeting('Ada', logger);
    expect(result).toBe('Hello, Ada!');
  });

  it('logs the greeting', () => {
    expect(logger.log).toHaveBeenCalledWith('Hello, World!');
  });
});
```

## Key Points

- `setup()` should accept an optional object of injectable overrides with sensible defaults
- `setup()` returns all state the tests need — spies, results, component instances, etc.
- Call `setup()` at the top of each `it` block; destructure only what that test needs
- Nested `describe` blocks may have their own `setup()` that wraps or extends the parent's
