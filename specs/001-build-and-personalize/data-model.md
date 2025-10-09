# Data Model: Personal Blog Customization & Indonesian Language Support

**Date**: 2025-10-09  
**Feature**: Personal Blog Customization & Indonesian Language Support  
**Phase**: 1 - Data Model Design

## Core Entities

### Blog Owner Profile

**Purpose**: Stores personal information and configuration for blog customization

**Attributes**:

- `name`: string - Blog owner's display name
- `bio`: string - Short biographical description
- `avatar`: string - Path to avatar image file
- `email`: string - Contact email address
- `socialLinks`: SocialLinks - Collection of social media profiles

**Validation Rules**:

- Name: required, 1-100 characters
- Bio: optional, max 500 characters
- Avatar: file path, auto-resized to 200x200px
- Email: valid email format
- Social links: optional but if provided must be valid URLs

**State Transitions**: Static configuration (no state changes during runtime)

### SocialLinks

**Purpose**: Defines supported social media platform links

**Attributes**:

- `github`: string (optional) - GitHub profile URL
- `twitter`: string (optional) - Twitter/X profile URL  
- `linkedin`: string (optional) - LinkedIn profile URL
- `email`: string (optional) - Contact email (duplicate of main email)

**Validation Rules**:

- All URLs must be valid format if provided
- GitHub: must match github.com domain pattern
- Twitter: must match twitter.com or x.com domain pattern
- LinkedIn: must match linkedin.com domain pattern

### Language Configuration

**Purpose**: Manages trilingual support and localization settings

**Attributes**:

- `supportedLanguages`: array - ['en', 'zh', 'id']
- `defaultLanguage`: string - 'en' (configurable)
- `fallbackRules`: object - Language fallback hierarchy
- `dateFormats`: object - Locale-specific date formatting
- `translations`: object - UI string translations per language

**Validation Rules**:

- Supported languages must include at least one language
- Default language must be in supported languages list
- All translation keys must exist for each supported language
- Date formats must be valid locale strings

**Relationships**:

- Used by ContentPost for language variants
- Referenced by UI components for display strings

### ContentPost

**Purpose**: Represents blog posts with multilingual support

**Attributes**:

- `id`: string - Unique identifier (format: `{lang}/{slug}`)
- `slug`: string - URL-friendly post identifier
- `language`: string - Post language code (en/zh/id)
- `title`: string - Post title
- `description`: string (optional) - Post summary
- `content`: string - Markdown content body
- `tags`: array[string] - Post categorization tags
- `publishedDate`: Date - Publication timestamp
- `updatedDate`: Date (optional) - Last modification timestamp
- `license`: string (optional) - Content license override
- `ogImageUrl`: string (optional) - Custom Open Graph image

**Validation Rules** (from existing Zod schema):

- Title: required, non-empty string
- Tags: required array, at least one tag
- Published date: required, valid Date object
- Slug: auto-generated from filename, must be URL-safe
- Language: must be one of supported languages [en, zh, id]

**Relationships**:

- Language variants linked by slug (same slug across languages)
- Belongs to Language Configuration for supported languages

**State Transitions**:

- Draft → Published (file moved from drafts/ to posts/)
- Published → Updated (updatedDate modified)

### Theme Configuration

**Purpose**: Manages Dracula theme customization and visual branding

**Attributes**:

- `colorScheme`: object - Dracula color variables
- `typography`: object - Font and text styling settings
- `animations`: object - Motion animation configuration
- `responsiveBreakpoints`: object - Mobile/tablet/desktop breakpoints

**Validation Rules**:

- Color values must be valid CSS color formats
- Typography settings must not break accessibility contrast requirements
- Animation durations must be within constitution limits (0.3s-0.5s)
- Breakpoints must follow mobile-first approach

**Constraints**:

- Must maintain WCAG AA contrast ratios
- Dracula theme variables cannot be completely overridden
- Indonesian text must render properly with chosen typography

### Performance Metrics

**Purpose**: Tracks and validates performance requirements

**Attributes**:

- `lighthouseScores`: object - Performance, Accessibility, SEO scores
- `coreWebVitals`: object - LCP, FID, CLS measurements
- `bundleSize`: object - JavaScript bundle sizes per page
- `imageOptimization`: object - WebP conversion and sizing stats
- `searchPerformance`: object - Search index size and response times

**Validation Rules**:

- Lighthouse Performance score ≥ 95
- Lighthouse Accessibility score ≥ 95  
- LCP < 2.5 seconds
- FID < 100ms
- CLS < 0.1
- Bundle size < 100KB gzipped per page
- Search response time < 100ms for typical queries

**Measurement Context**:

- Testing environment: Mobile device simulation
- Network conditions: 3G throttling for realistic testing
- Content scale: 50+ posts for performance validation

## Data Relationships

```text
BlogOwnerProfile
├── SocialLinks (embedded)
└── ThemeConfiguration (references)

LanguageConfiguration
├── ContentPost[] (one-to-many)
└── UI Translations (embedded)

ContentPost
├── Language (foreign key to LanguageConfiguration)
└── Language Variants (linked by slug)

PerformanceMetrics
└── All entities (monitoring/validation)
```

## Storage Implementation

### File-Based Storage

**Content Posts**:

- Location: `src/content/posts/{language}/{slug}.md`
- Format: Markdown with YAML frontmatter
- Validation: Zod schema in `src/schemas/post.ts`

**Configuration**:

- Location: `src/config.ts`
- Format: TypeScript object export
- Validation: TypeScript type checking

**Translations**:

- Location: `src/utils/i18n.ts`
- Format: TypeScript object with nested keys
- Validation: TypeScript type checking + runtime key existence

**Search Indices**:

- Location: `public/{language}/posts/snapshots/`
- Format: JSON files generated at build time
- Size limit: Optimized per language to minimize payload

### Asset Storage

**Images**:

- User assets: `src/assets/` (processed by Astro)
- Static assets: `public/` (served directly)
- Avatar: `src/assets/avatar.webp` (auto-processed)

**Generated Assets**:

- Build output: `dist/` (GitHub Pages deployment)
- Search indices: Auto-generated during build
- Optimized images: Auto-generated by Astro Image component

## Migration Strategy

### Content Migration

1. **Remove Template Content**:

   - Delete all files in `src/content/posts/en/`
   - Delete all files in `src/content/posts/zh/`  
   - Preserve folder structure for user content

2. **Add Indonesian Structure**:

   - Create `src/content/posts/id/` directory
   - Create `src/content/info/id/about.md` for Indonesian about page
   - Add Indonesian translations to `src/utils/i18n.ts`

3. **Update Configuration**:

   - Replace avatar in `src/assets/avatar.webp`
   - Update personal information in `src/config.ts`
   - Add social media links for GitHub, Twitter, LinkedIn, Email

### Template Attribution

- Add credit to original creator (BlockLune) in footer component
- Maintain attribution while establishing personal branding
- Include link to original template repository if appropriate

## Validation & Constraints

### Type Safety

- All entities enforced through TypeScript interfaces
- Zod schema validation for content frontmatter
- Build-time validation with `astro check`

### Performance Constraints

- Search index JSON files kept under 1MB per language
- Image assets automatically optimized to WebP format
- Bundle size monitoring during build process

### Accessibility Requirements

- All text content must meet WCAG AA contrast standards
- Indonesian language metadata properly configured
- Semantic HTML structure maintained across all languages

### Internationalization Constraints

- All UI strings must have translations in all supported languages
- Date/time formatting must use appropriate locale settings
- URL structure must follow `/[lang]/[path]` pattern consistently
