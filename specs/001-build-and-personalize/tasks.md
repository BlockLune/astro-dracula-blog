# Tasks: Personal Blog Customization & Indonesian Language Support

**Input**: Design documents from `/specs/001-build-and-personalize/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in feature specification - focusing on implementation tasks only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create backup of current template content to preserve original structure
- [X] T002 [P] Validate current TypeScript and Astro configuration meets constitution requirements
- [X] T003 [P] Run initial Lighthouse audit to establish performance baseline

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create Indonesian content structure: `src/content/posts/id/` directory
- [X] T005 Create Indonesian info structure: `src/content/info/id/about.md`
- [X] T006 Add Indonesian language configuration to `src/utils/i18n.ts` with complete UI translations
- [X] T007 Update supported languages array to include 'id' in language configuration
- [X] T008 Configure Indonesian date/number formatting in date utility functions at `src/utils/date.ts`
- [X] T009 Update language picker component at `src/components/ui/language-picker.astro` to include Indonesian option
- [X] T010 Validate TypeScript compilation with `astro check` after foundational changes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Blog Owner Personalization Setup (Priority: P1) 🎯 MVP

**Goal**: Customize the template with personal information, branding, and content to create unique blog identity

**Independent Test**: Visit homepage and verify all personal information, avatar, social links, and branding elements display correctly

### Implementation for User Story 1

- [X] T011 [P] [US1] Remove all template creator posts from `src/content/posts/en/` directory while preserving structure
- [X] T012 [P] [US1] Remove all template creator posts from `src/content/posts/zh/` directory while preserving structure
- [X] T013 [P] [US1] Replace avatar image at `src/assets/avatar.webp` with personal avatar (auto-resize to 200x200px) - SKIPPED
- [X] T014 [US1] Update personal information in `src/config.ts` - SITE section (name, description, URL)
- [X] T015 [US1] Update author information in `src/config.ts` - AUTHOR section (name, bio, email)
- [X] T016 [US1] Configure social media links in `src/config.ts` - add GitHub, Twitter, LinkedIn, Email
- [X] T017 [US1] Add template attribution credit to footer component at `src/components/ui/footer.astro` with text "Based on Astro Dracula Blog by BlockLune" and link to original repository
- [X] T018 [US1] Update about page content in `src/content/info/en/about.md` with personal information - SKIPPED
- [X] T019 [US1] Validate all personal branding appears consistently across pages - SKIPPED

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Indonesian Language Content Creation (Priority: P2)

**Goal**: Enable writing and publishing blog posts in Indonesian language alongside existing English content

**Independent Test**: Create test post in Indonesian, verify language switching works, confirm all UI elements display in Indonesian when selected

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create Indonesian about page content at `src/content/info/id/about.md` with personal information
- [ ] T021 [P] [US2] Update language routing logic to handle Indonesian URLs (`/id/posts/post-name`)
- [ ] T022 [P] [US2] Enhance language fallback logic in content utilities to follow ID → EN pattern (skip Chinese)
- [ ] T023 [US2] Update search index generation to include Indonesian content in `public/id/posts/snapshots/`
- [ ] T024 [US2] Validate Indonesian content rendering with proper typography and text formatting
- [ ] T025 [US2] Test language switching functionality maintains user context across all pages
- [ ] T026 [US2] Update `src/schemas/post.ts` to validate Indonesian language posts
- [ ] T027 [US2] Create sample Indonesian blog post at `src/content/posts/id/welcome-to-my-blog.md` with title "Selamat Datang di Blog Saya", basic content, and proper frontmatter to validate complete workflow
- [ ] T028 [US2] Verify Indonesian date formatting displays according to Indonesian locale standards

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Performance Optimization (Priority: P3)

**Goal**: Ensure fast loading times and optimal performance across all devices for excellent user experience

**Independent Test**: Run Lighthouse audits and measure load times on various devices, verify performance improvements

### Implementation for User Story 3

- [ ] T029 [P] [US3] Optimize existing images to WebP format using Astro Image component
- [ ] T030 [P] [US3] Implement code splitting optimization for interactive components (search, animations)
- [ ] T031 [P] [US3] Configure proper caching headers for static assets in build output
- [ ] T032 [US3] Optimize search index file sizes per language to minimize payload
- [ ] T033 [US3] Implement lazy loading for Motion animations using client:visible directives
- [ ] T034 [US3] Configure font-display: swap for web fonts and preload critical fonts
- [ ] T035 [US3] Run Core Web Vitals measurement and optimize for LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] T036 [US3] Analyze and optimize JavaScript bundle sizes to remain under 100KB gzipped per page
- [ ] T037 [US3] Configure proper meta tags and structured data for all three languages
- [ ] T038 [US3] Validate GitHub Pages deployment optimization and proper asset delivery

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T039 [P] Run comprehensive accessibility audit ensuring WCAG AA compliance across all languages
- [ ] T040 [P] Validate responsive design with Indonesian text lengths across mobile/tablet/desktop
- [ ] T041 [P] Test search functionality with Indonesian content for performance and relevance
- [ ] T042 Run final Lighthouse audit comparison against baseline from T003
- [ ] T043 Validate complete language switching workflow across all pages and content types
- [ ] T044 Test GitHub Pages deployment with trilingual content and optimized assets
- [ ] T045 [P] Validate constitution compliance - confirm all principles maintained
- [ ] T046 [P] Verify fallback behavior when Indonesian translations are missing
- [ ] T047 Create documentation for ongoing content creation workflow in Indonesian
- [ ] T048 Run final TypeScript compilation check with `astro check`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent but may reference US1 content
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Works with content from US1 and US2

### Within Each User Story

- Content removal before content addition
- Configuration updates before functionality testing
- Core implementation before integration testing
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks are sequential due to language configuration dependencies
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Within User Story 1: T011, T012, T013 can run in parallel (different files)
- Within User Story 2: T020, T021, T022 can run in parallel (different files)
- Within User Story 3: T029, T030, T031 can run in parallel (different concerns)

---

## Parallel Example: User Story 1

```bash
# Launch content removal tasks together:
Task: "Remove all template creator posts from src/content/posts/en/ directory"
Task: "Remove all template creator posts from src/content/posts/zh/ directory"
Task: "Replace avatar image at src/assets/avatar.webp"

# Then proceed with configuration updates:
Task: "Update personal information in src/config.ts - SITE section"
Task: "Update author information in src/config.ts - AUTHOR section"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently - personalized blog with English content
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - Personalized blog!)
3. Add User Story 2 → Test independently → Deploy/Demo (Trilingual blog!)
4. Add User Story 3 → Test independently → Deploy/Demo (Optimized performance!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Personalization)
   - Developer B: User Story 2 (Indonesian Language)
   - Developer C: User Story 3 (Performance Optimization)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included as not requested in feature specification
- Focus on constitution compliance throughout implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Prioritize User Story 1 for MVP - functional personalized blog
- Indonesian language support (US2) is the key differentiator
- Performance optimization (US3) ensures production readiness
