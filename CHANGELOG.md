# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.4](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.1.3...v2.1.4) (2026-04-26)

### 🐛 Bug Fixes

* import core styles in Storybook to enable grid display ([579afb6](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/579afb6b3d1fcfca2804fc38f23e539db39fe5b8))

## [2.1.3](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.1.2...v2.1.3) (2026-04-26)

### 🐛 Bug Fixes

* add isAllowed=true to BlogAdmin story to prevent access denied ([d59c4da](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/d59c4da09f094b510fe8f3f32547172de3fe788e))

## [2.1.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.1.1...v2.1.2) (2026-04-26)

### 🐛 Bug Fixes

* force 2 columns in TwoColumns story (remove breakpoint) ([4da4e28](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/4da4e28272c29074831526006fe64726ba944f65))

## [2.1.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.1.0...v2.1.1) (2026-04-26)

### 🐛 Bug Fixes

* convert BlogAdmin story to docs-only (requires live backend) ([d774e47](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/d774e47e918ba7ea18b4c339519c231dec9523d2))

## [2.1.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.12...v2.1.0) (2026-04-26)

### ✨ Features

* add themeable BlogPostList & BlogPreview, refresh storybook ([9951d5d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/9951d5d4648d8e0209eb19dea0614a1ae0deef21))

### 🐛 Bug Fixes

* handle both {post} and raw post API responses ([15326de](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/15326de5d5e6bf36bd838ee128b7d11d016b4a09))
* migrate from blog schema to public schema with blog_ prefix ([bd1f3b9](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/bd1f3b98c192e184b70a161c38c7fc710cfa7963))
* streamline supabase migrations and enable demo mode RLS bypass ([6b8e149](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/6b8e149f6b7da17eb8295c83d57dfdfe30984472))
* update lockfile after removing @hello-pangea/dnd from admin ([6ce3aad](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/6ce3aada6372be79c6526f8096d571b8f22e9cd1))
* use valid UUID for demo user ID ([9bf1373](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/9bf1373046e4e8a71d381992de1192b8774a68d2))

## [2.0.12](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.11...v2.0.12) (2026-04-25)

### 🐛 Bug Fixes

* server re-exports types from /client instead of main ([44b5595](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/44b5595f569de92427744ed693859cf1d8e1449d))

## [2.0.11](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.10...v2.0.11) (2026-04-25)

### 🐛 Bug Fixes

* expand /client exports to include server-safe types and utils ([e357d7c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/e357d7cfe15db583b3b25f2886817ecdb601d7e8))

## [2.0.10](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.9...v2.0.10) (2026-04-25)

### 📚 Documentation

* update for /client subpath export ([2015b0e](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/2015b0eb4ab539b8483749df87e4fc38f00e469c))

## [2.0.9](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.8...v2.0.9) (2026-04-25)

### 🐛 Bug Fixes

* add /client subpath export for server-safe imports ([c0c5a6d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/c0c5a6d6177f00c95dcaddaa9f8c51d8e1bef745))

## [2.0.8](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.7...v2.0.8) (2026-04-25)

### 🐛 Bug Fixes

* add "use client" directive to BlogBuilderWithDefaults ([a0426db](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/a0426dbe67b950666695013ee31a497095de050b))

## [2.0.7](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.6...v2.0.7) (2026-04-25)

### 📚 Documentation

* add build scripts and comprehensive development guide ([7250eeb](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/7250eeb269cc333571d2f11b4ab0d661dbd1e900))

## [2.0.6](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.5...v2.0.6) (2026-04-25)

### 🐛 Bug Fixes

* import ContentBlockRenderer from core in BlogBuilder ([702bc06](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/702bc0691f675bb3c31530ac2cf618cba0c8aa20))

## [2.0.5](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.4...v2.0.5) (2026-04-25)

### 🐛 Bug Fixes

* externalize use-sync-external-store to prevent dynamic require ([d876c23](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/d876c23f71a22c3e12128e8ec8c13a057157ecf8))

## [2.0.4](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.3...v2.0.4) (2026-04-25)

### 🐛 Bug Fixes

* complete migration to [@m14i](https://github.com/m14i) scoped packages in example app ([bc0bfc0](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/bc0bfc0b6a54e6a1303632533d76dc819c3bcc11))

## [2.0.3](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.2...v2.0.3) (2026-04-25)

### 🐛 Bug Fixes

* update example app to use new [@m14i](https://github.com/m14i) scoped packages ([9acf35f](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/9acf35f62e6e94fea02833cfae0148bbe8008b18))

## [2.0.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.1...v2.0.2) (2026-04-25)

### ♻️ Code Refactoring

* extract constants and simplify code ([ceea418](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/ceea4185d517ba8877b02671d1d52671ccff96cd))

## [2.0.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v2.0.0...v2.0.1) (2026-04-25)

### ♻️ Code Refactoring

* simplify code with DRY/KISS principles ([04846a7](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/04846a758a31c03687bae01dcdb0a2d8aa9ddb7d))

## [2.0.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v1.1.0...v2.0.0) (2026-04-25)

### ⚠ BREAKING CHANGES

* Package split into @m14i/blogging-{core,admin,server}

- Split monolith into 3 focused packages for easier SaaS integration
- @m14i/blogging-core: Public blog UI (3 peer deps, ~50KB)
- @m14i/blogging-admin: CMS with WYSIWYG (11 peer deps, ~200KB)
- @m14i/blogging-server: API routes + AI (1 peer dep, ~110KB)

Migration:
- Update imports: m14i-blogging → @m14i/blogging-core
- Update imports: m14i-blogging/admin → @m14i/blogging-admin
- Update imports: m14i-blogging/server → @m14i/blogging-server
- See INSTALL.md for fresh installation guide

Benefits:
- 90% reduction in node_modules for read-only blogs
- Minimal peer dependencies for core package
- Better tree-shaking and bundle optimization
- Easier SaaS integration
- Same API, zero functional breaking changes

🤖 Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
* Remove blog_categories and blog_tags tables

Posts now use free-text category and tags fields only.
The blog.stats methods derive categories/tags from posts.

Removed:
- blog_categories and blog_tags database tables
- Category/tag CRUD API route handlers
- CategoryRow, TagRow and related types
- blog.categories.* and blog.tags.* client methods

Migration:
- Run supabase/migrations/20260423000000_remove_taxonomy_tables.sql
- Remove /api/blog/categories and /api/blog/tags routes
- Use blog.stats.getCategories() and blog.stats.getTags() instead

See BREAKING_CHANGES_v2.md for full migration guide.

### ✨ Features

* remove taxonomy tables, simplify to free-text categories/tags ([4c3e0e9](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/4c3e0e925a83b40b7dea6f7599aedc13d5efbefa))
* split monolith into modular packages ([4356fbe](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/4356fbee57ecaa6af9f7ffe8ef122e4326519683))

### 🐛 Bug Fixes

* force postcss>=8.5.10 via pnpm override ([df88a7c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/df88a7c22496cbc75b6b8f7e16502d9b9c8225f8))
* remove deleted PreviewView from storybook and update postcss ([db4b02b](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/db4b02b13703e1c6c65a33d1e6281a947729f4aa))

## [1.1.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v1.0.2...v1.1.0) (2026-04-13)

### ✨ Features

* add chart blocks and richer markdown rendering ([433c657](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/433c657edeb203074642eba33b2b47a24d06ee60))
* refine ai layout rules and builder layout options ([510df31](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/510df31dd1f4e009472f8fc67718a94a934aa6aa))

### 🐛 Bug Fixes

* harden admin preview and builder generation flow ([15097d7](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/15097d7aea90e5981c9f3f284df481de424ad547))
* support blog schema and normalize taxonomy responses ([7aaf650](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/7aaf65061fe9c6605967e40ff7aba49ec13ded2f))
* upgrade next to patched security release ([d1e5051](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/d1e505177c895789ef3051e39708d45e88c40ff3))

### 📚 Documentation

* refresh installation and supabase integration guides ([fcd2694](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/fcd269426bfe90eda9f11639f3d58a22207deca2))

## [1.0.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v1.0.1...v1.0.2) (2026-04-06)

### 🐛 Bug Fixes

* bundle @toon-format/toon instead of externalizing ([4c42fab](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/4c42fabadfaa96c47e0445bab794f946cea1f601))

## [1.0.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v1.0.0...v1.0.1) (2026-04-06)

### 🐛 Bug Fixes

* add missing @toon-format/toon dependency ([837e8d9](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/837e8d9ff779b9b0090a85cc193c263eb99c09e7))

## [1.0.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.19.0...v1.0.0) (2026-04-06)

### ⚠ BREAKING CHANGES

* - UX IMPROVEMENT:
- Move overlay from global BlogBuilder level to individual section level
- Each section gets its own overlay with spinner when generating
- Add generatingSections prop to BlogBuilder component
- Update BlogAdminComponents type to include generatingSections

VISUAL BEHAVIOR:
- Overlay appears ONLY on the section being generated
- Other sections remain fully visible and interactive
- Clearer visual feedback showing exactly which section is generating
- Section counter shows "Section X/Y" on the generating section

USER EXPERIENCE:
- User sees the entire layout structure
- Only the section in progress has an overlay
- Can see completed sections while others generate
- Less obtrusive, more focused feedback

### ✨ Features

* individual section overlay instead of global overlay ([f9be8c2](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/f9be8c2888755b39f150e173da8e0840dd48d03e))

### 🐛 Bug Fixes

* externalize @anthropic-ai/sdk and @toon-format/toon in server bundle ([273badb](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/273badb4586135547680f85ecdb5e319a9fe572c))
* isolate overlay to section card with overflow-hidden wrapper ([68e3a43](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/68e3a433035fc846391ef9a4877fab83a398028c))
* locking pnpm ([3108783](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/31087837a65d826e08062032157ecc2cc6f3f054))

## [0.19.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.18.2...v0.19.0) (2026-04-06)

### ✨ Features

* add visual overlay with spinner during section generation ([aee507a](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/aee507ad46bcfa6c71725f8c4d936179b98ee588)), closes [#B87333](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues/B87333)

## [0.18.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.18.1...v0.18.2) (2026-04-06)

### 🐛 Bug Fixes

* keep layout visible with spinners during section generation ([94c7d8c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/94c7d8c02c45ee6f33270d81a54c4af61718fd91))

## [0.18.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.18.0...v0.18.1) (2026-04-06)

### 🐛 Bug Fixes

* remove tags generation and force French language ([94c218c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/94c218cf16b291bea0b5a00a8ad6bfd479436fb0))

## [0.18.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.17.0...v0.18.0) (2026-04-06)

### ✨ Features

* drastically reduce text length for more visual content ([1366dfd](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/1366dfd7cf6cb65b06cedc3ffbc9774d098668dc))

## [0.17.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.16.4...v0.17.0) (2026-04-06)

### ✨ Features

* improve layout generation with proven Storybook patterns ([1eb6c67](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/1eb6c678be99228dc0f69b7e82f1e702680d7e86))

## [0.16.4](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.16.3...v0.16.4) (2026-04-05)

### 🐛 Bug Fixes

* add detailed error logging to AI section generation ([0c41ff4](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/0c41ff4a4e4f919ad888564869f86e47768ffcfc))

## [0.16.3](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.16.2...v0.16.3) (2026-04-05)

### 🐛 Bug Fixes

* extract JSON from response ignoring trailing text ([939ab6a](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/939ab6a0890dd877bff3bf0c87136f64b7cc0b8d))

## [0.16.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.16.1...v0.16.2) (2026-04-05)

### 🐛 Bug Fixes

* improve JSON generation reliability for section prompts ([3188a7a](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/3188a7a60b3678b7da8485bbeca5e663a9586536))

## [0.16.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.16.0...v0.16.1) (2026-04-05)

### 📚 Documentation

* add recommended Claude Haiku 4.5 model to README ([4803de3](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/4803de342f02ff25985b4983aef2665fc05e2b94))

## [0.16.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.15.1...v0.16.0) (2026-04-05)

### ✨ Features

* add all available layout types to generation prompt ([58dd352](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/58dd3524e4f96fbb311ae9ffdd2a38e5b9c0d232))
* add compact prompt format as alternative to TOON ([a6d345f](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/a6d345f9455ffe4039f2cefb9a6ce7ece27867b9))
* add detailed usage descriptions for each layout type ([81bbb59](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/81bbb59f2c3f2412d2343d77cd58a6040ad17ae2))

### 🐛 Bug Fixes

* remove corrupted TOON file and use compact prompts ([37d4b2b](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/37d4b2b8e0de4406c245104fa91888d9ce7a9a4e))

## [0.15.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.15.0...v0.15.1) (2026-04-05)

### 🐛 Bug Fixes

* correct TOON import - use encode instead of toon.format ([31da327](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/31da32734da7290236f6144843f38b7c0b48b8fd))

## [0.15.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.14.0...v0.15.0) (2026-04-05)

### ✨ Features

* add French language support and TOON-optimized prompts ([8a55c2d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/8a55c2d05b6eb0339cb173d43601912b0974a8e0))
* trigger release for French + TOON features ([0a11512](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/0a115125937bf2445e17a9f0118e273be99c517e))

## [0.15.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.14.0...v0.15.0) (2026-04-05)

### ✨ Features

* add French language support and TOON-optimized prompts ([8a55c2d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/8a55c2d05b6eb0339cb173d43601912b0974a8e0))
* trigger release for French + TOON features ([0a11512](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/0a115125937bf2445e17a9f0118e273be99c517e))

## [0.15.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.14.0...v0.15.0) (2026-04-05)

### ✨ Features

* add French language support and TOON-optimized prompts ([8a55c2d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/8a55c2d05b6eb0339cb173d43601912b0974a8e0))

## [0.14.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.13.1...v0.14.0) (2026-04-05)

### ✨ Features

* afficher les sections du layout immédiatement avec placeholders + spinners ([9c3f0a2](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/9c3f0a2d2cbcc810ac76605e72c5b9d578105685))

### 🐛 Bug Fixes

* add missing LayoutSection import to EditorView ([dff01ca](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/dff01cae4ab314c2030f752d6366292eaa165d15))
* correct TypeScript type for placeholder sections ([3f112ed](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/3f112ed3bec48917ba4ce2db0d3c5cbabc8ee34a))

## [0.13.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.13.0...v0.13.1) (2026-04-05)

### 🐛 Bug Fixes

* afficher la progression de génération DANS le dialog au lieu de derrière ([d268f2d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/d268f2ddc2a78b7f22cd3b4c30ccc0ec23682ff3))

## [0.13.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.12.0...v0.13.0) (2026-04-05)

### ✨ Features

* amélioration majeure du prompt de génération de layout pour designs visuellement attractifs ([3e7cc65](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/3e7cc6592bdfdfe88e005ea873f15996b21a3585))

## [0.12.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.11.0...v0.12.0) (2026-04-05)

### ✨ Features

* optimize AI prompts for concise, high-quality blog content (2025 best practices) ([cbbc169](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/cbbc1696a1c2c46b1c7cad8e7643ab3b4bcdadca))

## [0.11.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.10.0...v0.11.0) (2026-04-05)

### ✨ Features

* add layout and classNames props for customizable editor layout ([f5762d1](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/f5762d1bfaf2df72e9b4f909013723476af7e116))

## [0.10.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.9.0...v0.10.0) (2026-04-05)

### ✨ Features

* add live progress indicators for progressive blog generation ([a3b173e](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/a3b173e4aed2e29ca5b395091bd4782b1ebafe87))

## [0.9.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.8.0...v0.9.0) (2026-04-05)

### ✨ Features

* implement two-step UI flow for progressive blog generation ([150b31c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/150b31c19b5f1e6d363b16c3eb8ed6683edc5f00))

## [0.8.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.7.3...v0.8.0) (2026-04-05)

### ✨ Features

* add two-step blog generation (layout first, then content by section) ([6d7ee5c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/6d7ee5c6f6c97f02f43e0f2db59f5fb974990d68))

## [0.7.3](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.7.2...v0.7.3) (2026-04-05)

### 🐛 Bug Fixes

* add comprehensive JSON validation and ultra-strict prompt formatting ([daebfb7](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/daebfb79a16892ef6332264952a1051fbe2c6953))

## [0.7.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.7.1...v0.7.2) (2026-04-05)

### 🐛 Bug Fixes

* enforce strict JSON formatting with comprehensive prompt examples ([123894a](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/123894ae0d84268057191e017812a559fce2f897))

## [0.7.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.7.0...v0.7.1) (2026-04-05)

### 🐛 Bug Fixes

* improve markdown code block stripping to handle all formats ([848abb3](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/848abb3eb25f026bd9cd78c104778cdd9834e863))

## [0.7.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.6.1...v0.7.0) (2026-04-05)

### ✨ Features

* replace hardcoded colors with theme system in AI generation dialog ([f6f1995](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/f6f1995cdb0adbcee28d83a68b4999e2e664c406)), closes [#0A192F](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues/0A192F) [#F2F5F7](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues/F2F5F7) [#B87333](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues/B87333)

## [0.6.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.6.0...v0.6.1) (2026-04-05)

### ⚡ Performance Improvements

* add prompt caching for 80-90% faster generation on repeated calls ([c9df271](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/c9df2718d3cf1873491a5bd80ff3f40262a363bc))

## [0.6.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.5.3...v0.6.0) (2026-04-05)

### ✨ Features

* enhance AI blog generation with comprehensive improvements ([cc54008](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/cc54008e33a787b8382867101683db55b89f7bf4))

## [0.5.3](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.5.2...v0.5.3) (2026-04-05)

### 🐛 Bug Fixes

* strip markdown code blocks from AI JSON responses ([5d67f9e](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/5d67f9e305e7cca94d09ae56d42ad61a0d3bfecb))

## [0.5.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.5.1...v0.5.2) (2026-04-05)

### 🐛 Bug Fixes

* use apiClient from context instead of creating new instance ([b035bd3](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/b035bd37aed7350de30901ac212bc851a3fb3b4b))

## [0.5.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.5.0...v0.5.1) (2026-04-05)

### 🐛 Bug Fixes

* add Next.js server imports as external to prevent __dirname errors ([199d4b9](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/199d4b9de692b8f18cb6fade902100bb3d508a29))

## [0.5.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.4.2...v0.5.0) (2026-04-05)

### ✨ Features

* add .env.example and update README with simplified setup ([fdc119c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/fdc119c8676558741cc8672b2ae97087b3c724fe))
* add status label and update list view filters ([a44376d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/a44376de58ca253750307f51896a56f7a51aef27))

### 🐛 Bug Fixes

* add optional chaining and type safety for components ([ca5a62d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/ca5a62db13fba187b0853b2c3cba03f451b0ab72))

### 📚 Documentation

* add comprehensive guide for Blog component integration ([01dce05](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/01dce0502e95c5db8179d7383bca1d14992f12bf))
* add storybook restart and blog admin guide documentation ([fc176da](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/fc176da196155ca9ce20480f1e38f3c21f10435a))

## [0.4.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.4.1...v0.4.2) (2026-04-05)

### 🐛 Bug Fixes

* ensure schema fix is published ([59e2dc9](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/59e2dc9a8eca0d892c46df94638fd950b1e2ff68))

## [0.4.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.4.0...v0.4.1) (2026-04-05)

### 🐛 Bug Fixes

* use public schema for categories/tags tables (blog_categories, blog_tags) ([fef582c](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/fef582c32cd0182a524815e5cc35ee367026bfed))

## [0.4.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.3.0...v0.4.0) (2026-04-05)

### ✨ Features

* add dynamic category and tag management (v0.4.0) ([e7dfb94](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/e7dfb94ce14e0345fa50f898505c73c5f84852f0))

## [0.3.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.7...v0.3.0) (2026-04-05)

### ✨ Features

* add generateSlug utility for URL-friendly slug generation ([32d4200](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/32d4200ceddb0913c0dd41dfb6d41cf83641ae69))

## [0.2.7](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.6...v0.2.7) (2026-04-05)

### 🐛 Bug Fixes

* publish ([e8d65ab](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/e8d65ab2a6085209479d9b06518b2aded3ff27f7))

## [0.2.6](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.5...v0.2.6) (2026-04-05)

### 🐛 Bug Fixes

* remove registry-url from setup-node to enable OIDC ([f051963](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/f051963bf635bd03f3f2f2b6a74f38d97ac863ca))

## [0.2.5](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.4...v0.2.5) (2026-04-05)

### 🐛 Bug Fixes

* trusted publisher ([53ff22e](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/53ff22eacdb0db66066c213fbfeeb2bc9ca71794))
* trusted publisher ([4b55c5d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/4b55c5de22e8d3667b1da06f0178964adc0f9321))

## [0.2.4](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.3...v0.2.4) (2026-04-05)

### 🐛 Bug Fixes

* publish ([94ee082](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/94ee08290be1b78d72d07baad27c9545f4fa4b77))

## [0.2.3](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.2...v0.2.3) (2026-04-05)

### 📚 Documentation

* add Claude skills documentation and setup guide ([9181d0e](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/9181d0ec693045b5deaf852d4fed5a00b2283b5e))
* update README with AI-assisted setup instructions ([9cd26f1](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/9cd26f10e80e89f21eccd423f754fbf238975360))

## [0.2.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.1...v0.2.2) (2026-04-05)

### 📚 Documentation

* add v0.3.0 release notes and integration guide ([69b73d7](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/69b73d76ca6c3ab63ce33d62bf99116d1344ae95))

## [0.2.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.2.0...v0.2.1) (2026-04-05)

### 📚 Documentation

* add API routes integration guide for m14i-blogging package ([306f65a](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/306f65af19e8a11b5d608a8d05799dc5da8928e0))

## [0.2.0](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.1.5...v0.2.0) (2026-04-05)

### ✨ Features

* add content block editors for text, image, video, and quote ([8233355](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/8233355fbad89cc0cab04654c208606086c56610))

### 📚 Documentation

* simplify installation guide and move details to separate docs file ([44f9821](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/44f9821ba1a5d0e8fe329794b150a819ea0978b5))

### ♻️ Code Refactoring

* **BlogBuilder:** simplify imports and component structure ([e65cfef](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/e65cfef868b20c01e3eff27e289f7a92da33c679))

## [0.1.5](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.1.4...v0.1.5) (2026-04-05)

### 📚 Documentation

* update installation instructions and add package links ([813f725](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/813f7252c90060b0597d157a0df235a07a0e1ac9))

## [0.1.4](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.1.3...v0.1.4) (2026-04-05)

### 📚 Documentation

* expand README with comprehensive documentation and examples ([9ebab7d](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/9ebab7d0fd13114b1b4a104e205219429f1a7d02))

## [0.1.3](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.1.2...v0.1.3) (2026-04-05)

### 📚 Documentation

* clarify commit message format requirements ([7c79e01](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/7c79e0133ae5e90ef3f68d50aa37ff239614dc2a))

## [0.1.2](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.1.1...v0.1.2) (2026-04-05)

### 🐛 Bug Fixes

* **ci:** configure npm registry and fix repository URL ([e4f83a0](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/e4f83a072c6eafd2281f03ac1004418822abb7ca))

## [0.1.1](https://github.com/MerzoukeMansouri/m14i-blogging-package/compare/v0.1.0...v0.1.1) (2026-04-05)

### 🐛 Bug Fixes

* **ci:** update Node.js version to 22 for semantic-release compatibility ([2dfe44f](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/2dfe44f3b1a7b7d337f313d72e8046db02406160))
* **deps:** add conventional-changelog-conventionalcommits dependency ([a172360](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/a172360b4340337c0adfbc06025948cf121732de))

### 📚 Documentation

* update workflow documentation and consolidate release process ([e239ef9](https://github.com/MerzoukeMansouri/m14i-blogging-package/commit/e239ef94be93cb54fcc37fd4aa783540fbf05074))
