# GitHub Actions Workflows

This directory contains the automated workflow for the m14i-blogging package.

## Workflow

### `release.yml` - Release & Deploy

**Trigger**: Push to `main` branch

**What it does**:

This single workflow handles both package releases and Storybook deployment in two jobs:

#### Job 1: Release Package
1. Analyzes commits using conventional commit format
2. Determines next version automatically (major/minor/patch)
3. Updates `package.json` and `CHANGELOG.md`
4. Creates git tag
5. Builds the package
6. Publishes to npm registry
7. Creates GitHub Release with generated notes

#### Job 2: Deploy Storybook
8. Builds Storybook
9. Deploys to GitHub Pages
10. Updates documentation site

**Requirements**:
- `NPM_TOKEN` secret must be set in repository settings
- GitHub Pages must be enabled with "GitHub Actions" as source
- Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) format

**How releases work**:
```bash
# No manual version bumping needed!
# Just commit with conventional format:
git commit -m "feat: add new feature"    # → Minor release (0.1.0 → 0.2.0)
git commit -m "fix: resolve bug"         # → Patch release (0.1.0 → 0.1.1)
git commit -m "feat!: breaking change"   # → Major release (0.1.0 → 1.0.0)

# Push to main (via PR or direct)
git push origin main

# This single workflow:
# ✅ Releases package (if commits trigger a release)
# ✅ Deploys Storybook to GitHub Pages (always)
```

**Results**:
- Package published to npm: `m14i-blogging@<version>`
- Storybook accessible at: `https://MerzoukeMansouri.github.io/m14i-blogging-package/`
- GitHub Release created with changelog

## Setup Instructions

### 1. NPM Token Setup

1. Go to [npmjs.com](https://www.npmjs.com/) and login
2. Click on your profile → **Access Tokens**
3. Click **Generate New Token** → **Automation**
4. Copy the token
5. Go to your GitHub repository
6. Navigate to **Settings** → **Secrets and variables** → **Actions**
7. Click **New repository secret**
8. Name: `NPM_TOKEN`
9. Value: Paste your npm token
10. Click **Add secret**

### 2. GitHub Pages Setup

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

That's it! The workflows will now run automatically.

## Workflow Status

You can check workflow runs:
1. Go to the **Actions** tab in your repository
2. Select a workflow from the left sidebar
3. View recent runs and their status

## Troubleshooting

### Publish workflow not running
- Check if the version in `package.json` actually changed
- Ensure you pushed the tag: `git push --tags`

### Storybook deployment failing
- Check if GitHub Pages is enabled
- Verify the build-storybook script works locally: `pnpm run build-storybook`

### NPM publish failing
- Verify `NPM_TOKEN` secret is set correctly
- Check if the package name is available on npm
- Ensure you have publish permissions for the package
