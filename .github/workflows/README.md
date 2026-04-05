# GitHub Actions Workflows

This directory contains automated workflows for the m14i-blogging package.

## Workflows

### 1. `publish.yml` - NPM Package Publishing

**Trigger**: Push to `main` branch (when version in package.json changes)

**What it does**:
1. Checks if the version in `package.json` has changed
2. If changed, creates a git tag (e.g., `v0.1.1`)
3. Builds the package
4. Publishes to npm registry
5. Creates a GitHub Release

**Requirements**:
- `NPM_TOKEN` secret must be set in repository settings

**How to trigger a release**:
```bash
# Bump version (patch/minor/major)
pnpm run release:patch

# This will:
# - Update package.json version
# - Commit the change
# - Create and push a tag
# - Trigger the publish workflow
```

### 2. `storybook.yml` - Storybook Deployment

**Trigger**: Push to `main` branch

**What it does**:
1. Installs dependencies
2. Builds Storybook
3. Deploys to GitHub Pages

**Requirements**:
- GitHub Pages must be enabled with "GitHub Actions" as source

**Result**:
- Storybook accessible at: `https://MerzoukeMansouri.github.io/m14i-blogging-package/`

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
