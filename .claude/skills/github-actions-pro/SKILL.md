---
name: github-actions-pro
description: Expert at writing production-grade GitHub Actions workflows. Use when creating, reviewing, or optimizing CI/CD pipelines, workflows, composite actions, or deployment automation.
---

# GitHub Actions Pro

You are an expert in GitHub Actions and CI/CD automation. Apply these principles when creating or reviewing workflows.

## Core Principles

### 1. Workflow Structure
- Use clear naming: `ci.yml`, `deploy.yml`, `release.yml`
- Organize jobs with explicit `needs:` dependencies
- Run independent jobs in parallel
- Use `if:` conditions for conditional execution

### 2. DRY - Don't Repeat Yourself
- Extract common steps into **composite actions** (`.github/actions/<name>/action.yml`)
- Use **reusable workflows** for shared job patterns
- Cache dependencies (npm, pip, etc.) for faster runs

### 3. Security Best Practices
- Use `secrets.` context for sensitive data - never hardcode
- Set minimal `permissions:` (principle of least privilege)
- Use `GITHUB_TOKEN` over PATs when possible
- Pin action versions to SHA or major version (e.g., `@v4` or `@sha`)

### 4. Performance
- Cache dependencies: `actions/cache` or built-in cache in setup actions
- Use matrix builds for multi-version testing
- Set `timeout-minutes` on long jobs
- Use `concurrency` to cancel stale runs

## Common Patterns

### Composite Action (reusable steps)
```yaml
# .github/actions/setup-node/action.yml
name: Setup Node
description: Checkout and setup Node.js with dependencies
runs:
  using: composite
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: npm
    - run: npm ci
      shell: bash
```

### Conditional Deploy (main branch only)
```yaml
deploy:
  needs: [lint, test]
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: ./.github/actions/setup-node
    - run: npm run build
    - run: npm run deploy
```

### Branch-specific Triggers
```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Caching npm Dependencies
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm  # Built-in caching
```

### Matrix Builds
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
    os: [ubuntu-latest, windows-latest]
```

### Cancel Stale Runs
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### Artifact Upload/Download
```yaml
# Upload
- uses: actions/upload-artifact@v4
  with:
    name: build-${{ github.sha }}
    path: dist/

# Download in another job
- uses: actions/download-artifact@v4
  with:
    name: build-${{ github.sha }}
```

## Review Checklist

When reviewing workflows, verify:
- [ ] Clear job names and purposes
- [ ] Explicit `needs:` dependencies between jobs
- [ ] Caching enabled for dependencies
- [ ] Secrets not logged or exposed
- [ ] Minimal permissions set
- [ ] Timeouts configured for long jobs
- [ ] Matrix builds for multi-environment testing
- [ ] Composite actions for repeated steps (3+ occurrences)
- [ ] Concurrency settings to avoid duplicate runs

## Anti-Patterns to Avoid

- Hardcoded secrets or tokens
- Missing `shell: bash` in composite action run steps
- No caching for dependency installation
- Overly permissive `permissions: write-all`
- Single monolithic job instead of parallel jobs
- Missing timeout on potentially long-running jobs
