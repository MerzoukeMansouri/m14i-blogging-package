# Contributing to m14i-blogging

Thank you for your interest in contributing to m14i-blogging! This document provides guidelines and instructions for contributing.

## 🚀 Release Process

This project uses **[semantic-release](https://github.com/semantic-release/semantic-release)** for fully automated versioning and publishing based on conventional commits.

### How It Works

**Releases are completely automatic!** You don't manually bump versions. Instead:

1. **Write conventional commits** (e.g., `feat:`, `fix:`)
2. **Merge to `main`**
3. **semantic-release** automatically:
   - Determines the next version
   - Generates changelog
   - Publishes to npm
   - Creates GitHub release
   - Deploys Storybook

👉 **See [Release Process Guide](./docs/RELEASE_PROCESS.md) for detailed documentation**

### Quick Start

#### 1. Make Your Changes

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make changes and commit using conventional format
git add .
git commit -m "feat: add new awesome feature"

# Push your branch
git push origin feature/my-new-feature
```

#### 2. Create Pull Request

- Open a PR to merge into `main`
- Get it reviewed and approved
- Merge the PR

#### 3. Automatic Release & Deployment

When merged to `main`, one workflow automatically:

```
Commit: "feat: add carousel"
  ↓
Version: 0.1.0 → 0.2.0 (minor)
  ↓
✅ Publish to npm
✅ Create GitHub release
✅ Deploy Storybook to GitHub Pages
```

**Everything happens in a single workflow run!**

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add carousel component
fix: resolve image loading issue in BlogPreview
docs: update installation instructions
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/MerzoukeMansouri/m14i-blogging-package.git
cd m14i-blogging-package

# Install dependencies
pnpm install
```

### Development Commands

```bash
# Build the package
pnpm run build

# Watch mode (rebuild on changes)
pnpm run dev

# Start Storybook
pnpm run storybook

# Build Storybook
pnpm run build-storybook
```

### 🔄 Development Workflow (Monorepo)

This project is a pnpm workspace monorepo with two packages:
- **Root** (`/`) - The library package (`m14i-blogging`)
- **Example App** (`/example/app`) - A Next.js demo app

#### Important: Changes Don't Auto-Reflect in Example App

When you modify library source code (`src/**`), you **MUST rebuild** before changes appear in the example app:

```bash
# After editing library code (src/**)
pnpm build

# Then restart the example app if running
cd example/app
pnpm dev
```

#### Development Modes

**Option 1: Watch Mode (Recommended)**
```bash
# Terminal 1: Auto-rebuild library on changes
pnpm dev

# Terminal 2: Run example app
cd example/app
pnpm dev
```

**Option 2: Manual Build**
```bash
# Edit code in src/**
# Then build
pnpm build

# Test in example app
cd example/app
pnpm dev
```

#### Why Rebuild is Required

- The example app imports from `m14i-blogging` workspace dependency
- It reads compiled code from `dist/`, not source from `src/`
- Changes to `src/` only take effect after building to `dist/`

📖 **See [Development Workflow Guide](./.claude/DEVELOPMENT.md) for detailed development patterns and troubleshooting**

## 🧪 Testing

Before submitting a PR:

1. **Build the package**: `pnpm run build`
2. **Check Storybook**: `pnpm run storybook`
3. **Test locally**: Link the package locally to test in a Next.js app

```bash
# In this package directory
pnpm link --global

# In your test Next.js app
pnpm link --global m14i-blogging
```

## 📦 GitHub Secrets Required

For automated publishing to work, ensure these secrets are set in GitHub repository settings:

### Required Secrets

1. **`NPM_TOKEN`** (Required for npm publishing)
   - Go to [npmjs.com](https://www.npmjs.com/)
   - Navigate to Access Tokens in your account settings
   - Generate a new token with "Automation" type
   - Add it as a repository secret

2. **`GITHUB_TOKEN`** (Automatically provided)
   - This is automatically available in GitHub Actions
   - No manual setup needed

### Setting Up Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - Name: `NPM_TOKEN`
   - Value: Your npm automation token

## 🌐 GitHub Pages Setup

For Storybook deployment to work:

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. That's it! Storybook will deploy automatically on push to `main`

## 📚 Documentation

When adding new features:

1. Update the README.md if needed
2. Add examples to Storybook (`stories/` folder)
3. Update TypeScript types
4. Add documentation in the `docs/` folder if applicable

## 🐛 Reporting Bugs

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Version information
   - Code samples if applicable

## 💡 Suggesting Features

1. Open a new issue with the `enhancement` label
2. Describe the feature and use case
3. Provide examples if possible

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to open an issue for any questions about contributing!
