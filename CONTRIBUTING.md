# Contributing to m14i-blogging

Thank you for your interest in contributing to m14i-blogging! This document provides guidelines and instructions for contributing.

## 🚀 Release Process

This project uses automated GitHub Actions for publishing packages and deploying Storybook.

### How Releases Work

1. **Version Bumping**: Use npm version commands to bump the version
2. **Automatic Publishing**: When you push to `main`, GitHub Actions will:
   - Check if the version in `package.json` has changed
   - If changed, it will publish to npm and create a GitHub release
   - Deploy the Storybook to GitHub Pages

### Creating a Release

#### 1. Make Your Changes

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make your changes
# ... code, commit, etc.

# Push your branch
git push origin feature/my-new-feature
```

#### 2. Create a Pull Request

- Open a PR to merge into `main`
- Get it reviewed and approved
- Merge the PR

#### 3. Bump the Version

After merging to `main`, bump the version using one of these commands:

**Patch Release** (Bug fixes: 0.1.0 → 0.1.1):
```bash
pnpm run release:patch
```

**Minor Release** (New features: 0.1.0 → 0.2.0):
```bash
pnpm run release:minor
```

**Major Release** (Breaking changes: 0.1.0 → 1.0.0):
```bash
pnpm run release:major
```

These commands will:
- Update the version in `package.json`
- Create a git commit with the version bump
- Create a git tag (e.g., `v0.1.1`)
- Push both the commit and tag to GitHub

#### 4. Automatic Publishing

Once you push the version tag, GitHub Actions will automatically:

1. **Build the package**
2. **Publish to npm** (requires `NPM_TOKEN` secret)
3. **Create a GitHub Release** with release notes
4. **Deploy Storybook** to GitHub Pages

### Manual Version Bump (Alternative)

If you prefer manual control:

```bash
# Update version in package.json manually
# Then commit and tag:
git add package.json
git commit -m "chore: bump version to 0.1.1"
git tag v0.1.1
git push origin main --tags
```

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
