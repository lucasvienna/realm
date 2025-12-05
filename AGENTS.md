# AGENTS.md

This file provides guidance to AI agents when working with code in this
repository.

## Project Overview

`realm` is the web client for `empire`, a multi-client empire building game.
Built with SvelteKit 2 (using Svelte 5 with runes), TypeScript, and Tailwind
CSS 4.

## Package Management

**Always use `pnpm`** for all package management operations. Examples:

- Install dependencies: `pnpm install`
- Add package: `pnpm add <package>`
- Add dev dependency: `pnpm add -D <package>`

## Development Commands

```bash
# Development server (with host binding for network access)
pnpm dev

# Type checking
pnpm check                # One-time check
pnpm check:watch         # Watch mode

# Code formatting
pnpm format              # Prettier (write mode)
pnpm fmt                 # Oxfmt (write mode)

# Linting
pnpm lint                # Fix issues with oxlint and eslint
pnpm lint:ci             # Check only (CI mode) - runs prettier, oxfmt, oxlint, and eslint

# Testing
pnpm test                # Run all tests with Vitest
# Test projects are split into "client" (jsdom, *.svelte.test.ts) and "server" (node, *.test.ts)

# Build
pnpm build               # Production build
pnpm preview             # Preview production build
```

## Code Quality Tools

The project uses a multi-layered tooling setup:

1. **Prettier** - Primary formatter (config: `.prettierrc.yaml`)
   - Uses tabs (width: 2)
   - Double quotes (not single quotes)
   - Print width: 100 (80 for markdown)
   - Plugins: svelte, tailwindcss, @prettier/plugin-oxc

2. **Oxfmt** - Additional formatter (config: `.oxfmtrc.jsonc`)

3. **Oxlint** - Fast TypeScript/JavaScript linter (config: `.oxlintrc.json`)
   - Type-aware checking enabled
   - Runs before ESLint in the lint pipeline

4. **ESLint** - Additional linting (config: `eslint.config.js`)
   - TypeScript rules enabled
   - Svelte plugin configured
   - Unused vars must be prefixed with `_`

## Architecture

### Route Structure

The app uses SvelteKit's file-based routing with layout groups:

```
src/routes/
├── (marketing)/         # Public marketing pages (grouped layout)
│   ├── +page.svelte    # Landing page
│   ├── +page.server.ts
│   ├── +layout.svelte  # Marketing layout
│   └── about/
├── (app)/              # Authenticated app pages (grouped layout)
│   └── game/           # Main game interface
├── sign-in/            # Authentication pages (standalone)
├── sign-up/
├── account/            # Account management
├── +layout.svelte      # Root layout
└── +error.svelte       # Error page
```

**Data Loading Pattern:**

- Fetch initial/server-side data in `+page.server.ts` files using `load`
  functions
- Fetch follow-up/client-side data in `+page.ts` files using `load` functions

### Authentication

Cookie-based session management using custom implementation:

- **Session cookie:** `rsession` (defined in `src/lib/server/auth.ts:5`)
- **Middleware chain:** `hooks.server.ts:39-46` runs Paraglide (i18n) then auth
- **API bypass:** Routes starting with `/api` skip middleware to prevent
  recursion during session validation
- **Session validation:** `auth.validateSessionToken()` calls backend
  `/api/session` endpoint
- **Auth guard:** `auth.requireLogin()` redirects to `/sign-in` if not
  authenticated
- **User context:** Available in `event.locals.user` and `event.locals.session`
  (typed in `src/app.d.ts:4-7`)

### Internationalization (i18n)

Uses Paraglide.js for internationalization:

- Configuration: `vite.config.ts:12-15` - generates to `src/lib/paraglide`
- Middleware: `hooks.server.ts:8-15` handles locale detection and HTML lang
  replacement
- Project files: `project.inlang/` directory

### Backend Integration

Vite dev server proxies `/api/*` requests to `http://localhost:8000` (configured
in `vite.config.ts:18-24`). The path rewrite removes the `/api` prefix when
forwarding to the backend.

### Testing

Two separate test projects configured in `vite.config.ts:27-49`:

1. **Client tests** (`*.svelte.test.ts` or `*.svelte.spec.ts`):
   - Environment: jsdom
   - Uses `@testing-library/svelte`
   - Setup file: `vitest-setup-client.ts` (mocks matchMedia for Svelte 5)
   - Excludes: `src/lib/server/**`

2. **Server tests** (`*.test.ts` or `*.spec.ts`):
   - Environment: node
   - Excludes: `*.svelte.test.ts` files

### Svelte Configuration

- **Runes mode enabled** (`svelte.config.js:9`) - uses Svelte 5 runes syntax
- **Vite preprocessing** for TypeScript/SCSS support
- **Auto adapter** for flexible deployment

## Style Guidelines

Follow these official guides:

- [Svelte Style Guide](https://svelte.dev/docs#style-guide)
- [TypeScript Style Guide](https://www.typescriptlang.org/docs/handbook/styleguide.html)

Code smells to flag during review:

- Long functions or large classes
- Deep nesting
- Primitive obsession
- Long parameter lists
- Magic numbers or strings
- Inconsistent naming

## MCP Integration

You are able to use the Svelte MCP server, where you have access to
comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the
available tools effectively:

**Workflow:** Always call `list-sections` first, analyze the `use_cases` field,
then use `get-documentation` to fetch all relevant sections for the task.

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a
structured list with titles, use_cases, and paths. When asked about Svelte or
SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant
sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or
multiple sections. After calling the list-sections tool, you MUST analyze the
returned documentation sections (especially the use_cases field) and then use
the get-documentation tool to fetch ALL documentation sections that are relevant
for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions. You MUST use this tool
whenever writing Svelte code before sending it to the user. Keep calling it
until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code. After completing the
code, ask the user if they want a playground link. Only call this tool after
user confirmation and NEVER if code was written to files in their project.

## Important Notes

- Use **shacn/svelte** for UI components (see `AGENTS.md:5`)
  - <https://raw.githubusercontent.com/themesberg/flowbite/refs/heads/main/llms.txt>
- Node.js version: >=24.9.0 (specified in `package.json:7`)
- Tool versions managed by `mise.toml`
- Git status shows staged files: `.mcp.json`, `AGENTS.md`
- Don't build for me, this is a learning project. Focus on giving me direction
  and help!
