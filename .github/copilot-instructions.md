# Astro Dracula Blog - AI Coding Instructions

This is a multilingual blog built with Astro v5, React, and Tailwind CSS using the Dracula theme.

## Architecture Overview

- **Tech Stack**: Astro v5 + React + TypeScript + Tailwind CSS + Motion (Framer Motion)
- **Content System**: Astro Content Collections with frontmatter validation via Zod schemas
- **Styling**: Dracula theme with custom CSS variables, using Tailwind CSS classes
- **Build**: Static site generation with optional background processes for dev server

## Content System Patterns

### Post Structure
Posts live in `src/content/posts/{lang}/` with required frontmatter:
```typescript
// Required fields from PostFrontmatterSchema
title: string
tags: string[]
date: Date
// Optional fields
description?: string
updated?: Date
license?: string
ogImageUrl?: string
```

### Language Routing
- **File Pattern**: `src/content/posts/en/post-name.md` and `src/content/posts/zh/post-name.md`
- **URL Pattern**: `/en/posts/post-name` and `/zh/posts/post-name` 
- **Fallback Logic**: If post doesn't exist in requested language, falls back to other available languages
- **Configuration**: Default language set in `src/utils/i18n.ts` (`defaultLang`)

### Post ID System
- Astro v5 uses `id` instead of `slug` - format is `{lang}/{filename}`
- Use `getSlugFromId()` and `getLangFromId()` utilities to parse IDs
- `classifyByLangs()` groups posts by pure slug across languages

## Component Patterns

### File Organization
- **Astro Components**: `.astro` files for layouts and static components
- **React Components**: `.tsx` files for interactive UI (search, animations, cards)
- **Component Structure**: 
  - `src/components/ui/` - main UI components
  - `src/components/ui/cards/` - reusable card components  
  - `src/components/ui/tags/` - various tag types
  - `src/components/head/` - head metadata components

### Animation System
Uses Motion (Framer Motion) with consistent patterns:
```tsx
// Standard animation pattern
<motion.div
  initial={{ opacity: 0, x: 10 }}
  whileInView={{ opacity: 1, x: 0 }}
>
```

### Styling Conventions
- **CSS Classes**: `card-hoverable` for interactive cards, `text-dracula-{color}` for theme colors
- **Responsive**: Mobile-first approach with Tailwind responsive prefixes
- **Typography**: Uses `@tailwindcss/typography` with custom prose styling in `src/components/style/prose.astro`

## Configuration System

### Main Config (`src/config.ts`)
Central configuration with nested objects:
- `SITE` - site metadata, analytics, search engine verification
- `AUTHOR` - author details and social links  
- `MISC` - feature toggles, limits, and content settings (license, TOC, pagination)

### Content Config (`src/content.config.ts`)
Uses Astro's new glob loader pattern:
```typescript
loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" })
```

## Development Workflows

### Creating Content
Use `pnpm new` script for new posts:
```bash
pnpm new "Post Title"           # English post
pnpm new -l zh "文章标题"        # Chinese post  
pnpm new -d "Draft Title"       # Create draft
```

### Key Commands
- `pnpm dev` - Development server
- `pnpm build` - Production build (includes `astro check`)
- `pnpm new` - Create new post/draft

### Search System
- **Search Data**: Generated static JSON files at `/{lang}/posts/snapshots/`
- **Search Logic**: Fuse.js with keys: `["slug", "title", "description", "tags"]`
- **Implementation**: `PostStack` component handles both pagination and search

## Integration Points

### Markdown Processing
Custom remark/rehype plugins in `astro.config.mjs`:
- `remarkDescPlugin` - extracts descriptions from content
- `rehypeGithubAlerts` - GitHub-style alert boxes
- `rehypeMathjax` - math equation rendering

### I18n System
- **Translation Function**: `useTranslations(lang)` returns `t(key)` function
- **UI Strings**: Defined in `src/utils/i18n.ts` `ui` object
- **Path Helpers**: `useTranslatedPath()` for generating localized URLs
- **URL Parsing**: `getLangFromUrl()` extracts language from path

### Dynamic Routes  
Pages use `getStaticPaths()` to generate routes for all language combinations, with fallback logic for missing translations.

## Performance Considerations

- **Image Optimization**: Use `.webp` format (see `src/assets/avatar.webp`)
- **Lazy Loading**: PostStack component implements infinite scroll with dynamic loading
- **Static Generation**: All content pre-rendered as static files
- **Search Optimization**: Separate search index files limit data transfer
