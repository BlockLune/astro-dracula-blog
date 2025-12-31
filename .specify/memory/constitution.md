<!--
Sync Impact Report:
Version Change: 0.0.0 → 1.0.0
Initial Constitution Creation
Principles Established:
  - I. Code Quality & Maintainability
  - II. Testing Standards
  - III. User Experience Consistency
  - IV. Performance Requirements
  - V. Accessibility & I18n
Templates Status:
  - .specify/templates/plan-template.md: ✅ Verified - no updates needed
  - .specify/templates/spec-template.md: ✅ Verified - no updates needed
  - .specify/templates/tasks-template.md: ✅ Verified - no updates needed
Follow-up TODOs:
  - None - all placeholders filled
-->

# Astro Dracula Blog Constitution

## Core Principles

### I. Code Quality & Maintainability

Every code contribution MUST adhere to the following standards:

- **Type Safety**: All TypeScript code MUST have explicit type annotations for function parameters and return values. No use of `any` type except in extraordinary circumstances with documented justification.
- **Component Architecture**: React components MUST be functional components using hooks. Astro components MUST separate logic from presentation, keeping frontmatter concise.
- **File Organization**: Components MUST be organized by function (ui/, icons/, head/, cards/, tags/). Related files MUST be co-located. Maximum file length: 300 lines.
- **Code Style**: All code MUST pass ESLint and Prettier checks before commit. Husky pre-commit hooks MUST be maintained. No bypassing linters without documented exception.
- **Documentation**: Complex logic, non-obvious patterns, and public APIs MUST have JSDoc comments. Configuration files MUST include inline comments explaining purpose.

**Rationale**: Maintaining a clean, type-safe codebase ensures long-term maintainability, reduces bugs, and enables confident refactoring. The blog is a personal project that should remain easy to extend over years.

### II. Testing Standards

Testing requirements for the Astro Dracula Blog:

- **Build Validation**: `astro check` MUST pass before any build. TypeScript errors are blocking.
- **Manual Testing Gates**: For new features touching critical paths (search, navigation, content rendering, i18n), manual testing MUST verify functionality in both languages (en/zh) and across responsive breakpoints (mobile/tablet/desktop).
- **Regression Prevention**: Before release, test these critical user journeys:
  1. Homepage loads and displays recent posts
  2. Search functionality returns correct results
  3. Post pages render with proper styling and TOC
  4. Language switching maintains context
  5. Tag pages filter correctly
- **Visual Regression**: Screenshots of major pages (home, post, about, tags) SHOULD be reviewed for unintended visual changes.
- **Lighthouse Standards**: Performance score MUST remain above 90. Accessibility score MUST remain above 95.

**Rationale**: As a static site generator project without runtime tests, manual validation gates and build checks prevent regressions. Lighthouse scores ensure the blog remains fast and accessible.

### III. User Experience Consistency

The user experience MUST maintain these standards:

- **Dracula Theme Fidelity**: All new UI elements MUST use color variables from `src/styles/global.css`. No hardcoded colors. Theme colors: `--dracula-*` variables for all text, backgrounds, and accents.
- **Animation Consistency**: All animations MUST use Motion (Framer Motion) with consistent patterns:
  - Page transitions: `initial={{ opacity: 0 }}` → `whileInView={{ opacity: 1 }}`
  - Hover states: Use `.card-hoverable` class pattern with transform scale
  - Duration: Standard 0.3s, complex 0.5s maximum
- **Responsive Design**: All components MUST be mobile-first with Tailwind breakpoints. Test on: mobile (375px), tablet (768px), desktop (1280px).
- **Typography**: Prose styling MUST use `@tailwindcss/typography` with custom Dracula overrides in `src/components/style/prose.astro`. No inline typography styles.
- **Navigation**: Language picker MUST be visible on all pages. Post navigation MUST maintain language context.
- **Loading States**: Interactive components (search, infinite scroll) MUST provide visual feedback during loading.

**Rationale**: Consistency builds user trust and makes the blog feel polished. The Dracula theme is a defining characteristic that must be preserved across all features.

### IV. Performance Requirements

Performance is a core value proposition of this blog:

- **Static Generation**: All routes MUST be statically generated at build time. No client-side fetching of post content.
- **Image Optimization**: All images MUST be in WebP format. Use Astro's Image component for automatic optimization. Images MUST have explicit width/height to prevent CLS.
- **Bundle Size**: JavaScript bundles MUST remain under 100KB gzipped per page. Analyze with `astro build` output.
- **Code Splitting**: Interactive components (search, animations) MUST use client:load or client:visible directives appropriately. Prefer client:idle for non-critical interactions.
- **Search Performance**: Search index JSON files MUST be generated per language to limit payload size. Fuse.js search MUST respond within 100ms for typical queries (tested with 50+ posts).
- **Font Loading**: Web fonts MUST use font-display: swap. Critical fonts MUST be preloaded.
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

**Rationale**: Fast load times are essential for user retention and SEO. As a static blog, we should maintain the performance advantages Astro provides.

### V. Accessibility & I18n

The blog MUST be accessible and truly multilingual:

- **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3). Links MUST have descriptive text. Images MUST have alt text.
- **Keyboard Navigation**: All interactive elements MUST be keyboard accessible. Focus states MUST be visible.
- **ARIA Labels**: Use ARIA labels for icon-only buttons and dynamic content regions (search results, infinite scroll).
- **Color Contrast**: All text MUST meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text). Dracula theme colors are pre-validated.
- **I18n Completeness**: All UI strings MUST be translated in `src/utils/i18n.ts`. New features MUST support all supported languages (en/zh/id).
- **Fallback Logic**: Posts MUST gracefully fall back to available language if translation missing. No broken links.
- **Language Metadata**: All pages MUST include proper lang attribute and hreflang tags for SEO.

**Rationale**: Accessibility is a fundamental right. True i18n support (not just English with translations) makes the blog useful to a broader audience and respects the bilingual nature of the author's content.

## Content Management Standards

Content creation and organization:

- **Frontmatter Validation**: All posts MUST pass Zod schema validation defined in `src/schemas/post.ts`. Required fields: title, tags, date.
- **Markdown Standards**: Use consistent heading levels. Code blocks MUST specify language. Use GitHub-style alerts for callouts.
- **Asset Organization**: Post images SHOULD be in `src/assets/` (for optimization) or `public/` (for static files). Prefer WebP format.
- **Slug Consistency**: Post slugs MUST be lowercase, hyphenated, and match across language versions (en/[slug].md and zh/[slug].md).
- **Draft Management**: Work-in-progress posts MUST use the drafts folder (`src/content/drafts/`). Use `pnpm new -d` command.
- **License Information**: License information MUST be configured in `src/config.ts`. Per-post overrides allowed via frontmatter.

## Development Workflow Standards

Standard practices for development:

- **Branch Strategy**: Main branch is production-ready. Feature branches for experiments. No direct commits to main for feature work.
- **Commit Messages**: Use conventional commits format: `type(scope): description`. Types: feat, fix, docs, style, refactor, perf, test.
- **Build Before Commit**: Lint-staged ensures formatting and linting on commit. MUST pass before push.
- **Configuration Changes**: Changes to `astro.config.mjs`, `tailwind.config.mjs`, or `src/config.ts` MUST include comments explaining purpose.
- **Dependency Updates**: MUST review breaking changes before updating major versions. Test thoroughly after dependency updates.
- **New Post Workflow**: Use `pnpm new` script rather than manually creating files to ensure proper structure and frontmatter.

## Governance

This Constitution defines the non-negotiable standards for the Astro Dracula Blog project. All development work MUST align with these principles.

### Amendment Process

1. Propose changes via documented issue or discussion
2. Evaluate impact on existing codebase and templates
3. Update constitution with incremented version number following semantic versioning
4. Update dependent templates and documentation
5. Document rationale for changes in commit message

### Compliance

- All pull requests MUST verify compliance with these principles
- GitHub Copilot and AI assistants MUST follow these standards when generating code
- Any deviation MUST be explicitly justified in code comments or PR description
- Regular audits (quarterly) SHOULD verify adherence to performance and accessibility standards

### Version Management

- **MAJOR**: Backward incompatible changes (e.g., removing a principle, changing core architecture requirements)
- **MINOR**: New principles added or materially expanded guidance (e.g., adding new quality gate)
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements

**Version**: 1.0.0 | **Ratified**: 2025-10-09 | **Last Amended**: 2025-10-09
