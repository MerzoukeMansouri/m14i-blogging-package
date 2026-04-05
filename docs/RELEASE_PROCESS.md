# Release Process with Semantic Release

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and package publishing based on conventional commits.

## 🚀 How It Works

Semantic-release **automatically**:
1. Analyzes commits since the last release
2. Determines the next version number (major, minor, or patch)
3. Generates release notes and changelog
4. Updates `package.json` version
5. Creates a git tag
6. Publishes to npm
7. Creates a GitHub release

**You don't manually bump versions** - it's all automatic based on your commit messages!

## 📝 Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types and Version Bumps

| Type | Description | Version Bump | Example |
|------|-------------|--------------|---------|
| `feat` | New feature | **Minor** (0.1.0 → 0.2.0) | `feat: add carousel component` |
| `fix` | Bug fix | **Patch** (0.1.0 → 0.1.1) | `fix: resolve image loading issue` |
| `perf` | Performance improvement | **Patch** (0.1.0 → 0.1.1) | `perf: optimize bundle size` |
| `docs` | Documentation changes | **Patch** (0.1.0 → 0.1.1) | `docs: update installation guide` |
| `refactor` | Code refactoring | **Patch** (0.1.0 → 0.1.1) | `refactor: simplify theme logic` |
| `BREAKING CHANGE` | Breaking changes | **Major** (0.1.0 → 1.0.0) | See below |

### Types That Don't Trigger Releases

These commits won't create a new release:
- `style:` - Code formatting
- `test:` - Adding/updating tests
- `build:` - Build system changes
- `ci:` - CI/CD changes
- `chore:` - Other changes

## 📚 Commit Examples

### Feature (Minor Release)

```bash
git commit -m "feat: add PDF content block support

Adds new PDFBlock component with embed and download options.
Users can now display PDF documents in blog posts."
```

### Bug Fix (Patch Release)

```bash
git commit -m "fix: resolve carousel autoplay not working

Fixed issue where carousel autoplay would stop after first cycle.
Now properly loops when autoPlay is enabled."
```

### Documentation (Patch Release)

```bash
git commit -m "docs: add Tailwind CSS setup instructions

Added comprehensive guide for configuring Tailwind CSS
in the installation section."
```

### Breaking Change (Major Release)

```bash
git commit -m "feat: redesign theme API

BREAKING CHANGE: Theme configuration has been restructured.
The old `colors` prop is now nested under `theme.palette`.

Migration:
- Old: `<BlogPreview colors={{ primary: '#fff' }} />`
- New: `<BlogPreview theme={{ palette: { primary: '#fff' } }} />`
```

Or using the footer:

```bash
git commit -m "refactor: remove deprecated BlogBuilder props

Removed 'onUpdate' prop in favor of 'onChange'.

BREAKING CHANGE: The 'onUpdate' callback has been removed.
Use 'onChange' instead."
```

## 🔄 Release Workflow

### 1. Make Your Changes

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes and commit using conventional commits
git add .
git commit -m "feat: add new awesome feature"

# Push your branch
git push origin feature/my-feature
```

### 2. Create Pull Request

- Open a PR to merge into `main`
- Ensure PR title also follows conventional commits
- Get it reviewed and approved

### 3. Merge to Main

When you merge to `main`, **one unified workflow** automatically runs two jobs:

#### Job 1: Release Package
```
Commit: "feat: add carousel component"
  ↓
GitHub Actions triggers
  ↓
semantic-release analyzes commits
  ↓
Determines version: 0.1.0 → 0.2.0 (minor bump for "feat")
  ↓
Updates package.json to 0.2.0
  ↓
Generates CHANGELOG.md
  ↓
Creates git tag v0.2.0
  ↓
Publishes to npm
  ↓
Creates GitHub Release with notes
```

#### Job 2: Deploy Storybook
```
After release completes
  ↓
Builds Storybook
  ↓
Deploys to GitHub Pages
  ↓
Storybook updated at:
https://MerzoukeMansouri.github.io/m14i-blogging-package/
```

**Note**: Storybook deploys on every push to `main`, even if no release is created.

## 📋 Generated Changelog

Semantic-release automatically generates a `CHANGELOG.md` with sections:

- ✨ **Features** - New features (feat)
- 🐛 **Bug Fixes** - Bug fixes (fix)
- ⚡ **Performance Improvements** - Performance improvements (perf)
- 📚 **Documentation** - Documentation changes (docs)
- ♻️ **Code Refactoring** - Code refactoring (refactor)
- ⏪ **Reverts** - Reverted changes (revert)

Example:

```markdown
## [0.2.0](https://github.com/.../compare/v0.1.0...v0.2.0) (2025-04-05)

### ✨ Features

* add carousel component ([abc1234](link-to-commit))
* add PDF content block support ([def5678](link-to-commit))

### 🐛 Bug Fixes

* resolve image loading issue in BlogPreview ([ghi9012](link-to-commit))
```

## 🎯 Best Practices

### 1. **Write Clear Commit Messages**
```bash
# ✅ Good
git commit -m "feat: add carousel autoplay option

Adds autoPlay and autoPlayInterval props to CarouselBlock.
Defaults to 3000ms interval."

# ❌ Bad
git commit -m "update carousel"
```

### 2. **One Feature Per Commit**
```bash
# ✅ Good
git commit -m "feat: add carousel component"
git commit -m "docs: add carousel documentation"

# ❌ Bad
git commit -m "feat: add carousel and update docs and fix bug"
```

### 3. **Use Breaking Changes Carefully**
```bash
# Only for actual API breaking changes
git commit -m "feat: redesign theme system

BREAKING CHANGE: Theme configuration restructured.
See migration guide in docs/MIGRATION.md"
```

### 4. **Scope Your Commits** (Optional)
```bash
git commit -m "feat(carousel): add autoplay support"
git commit -m "fix(seo): correct meta tag generation"
git commit -m "docs(readme): update installation steps"
```

## 🔍 Check What Will Be Released

Before pushing to `main`, you can preview what semantic-release will do:

```bash
# Install semantic-release CLI
pnpm add -D semantic-release

# Dry run (doesn't actually release)
npx semantic-release --dry-run
```

## 🚨 Troubleshooting

### No Release Created

**Reason**: No commits since last release trigger a version bump.

**Solution**: Ensure at least one commit with `feat:`, `fix:`, or `BREAKING CHANGE:`

### Wrong Version Bump

**Reason**: Incorrect commit message format.

**Solution**: Use correct conventional commit format:
- `feat:` for new features (minor)
- `fix:` for bug fixes (patch)
- `BREAKING CHANGE:` for breaking changes (major)

### Release Failed

Check GitHub Actions logs:
1. Go to **Actions** tab
2. Click on failed workflow
3. Check error messages

Common issues:
- NPM_TOKEN not set or expired
- Build failed
- Lint/test errors

## 📖 Learn More

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [semantic-release Documentation](https://github.com/semantic-release/semantic-release)
- [Commit Message Examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)

## ⚙️ Configuration

The semantic-release configuration is in `.releaserc.json`:

- **Branches**: `main` - only releases from main branch
- **Plugins**: Configured for npm, GitHub, changelog, and git
- **Release Rules**: Defined in commit-analyzer config

To modify the release behavior, edit `.releaserc.json`.
