# Publishing Guide

Steps to publish new packages to npm.

---

## Prerequisites

1. **NPM account** with access to `@m14i` scope
2. **Logged in**: `npm login`
3. **All builds passing**: `pnpm -r build`
4. **Tests passing** (if any)

---

## Publishing Order

Must publish in dependency order:

### 1. Core (no dependencies)
```bash
cd packages/core
pnpm build
npm publish --access public
```

### 2. Server (depends on core)
```bash
cd packages/server
pnpm build
npm publish --access public
```

### 3. Admin (depends on core + server)
```bash
cd packages/admin
pnpm build
npm publish --access public
```

---

## Version Management

**Semantic versioning**: `MAJOR.MINOR.PATCH`

- **PATCH** (1.0.X): Bug fixes
- **MINOR** (1.X.0): New features (backward compatible)
- **MAJOR** (X.0.0): Breaking changes

### Update Versions

**Sync all packages**:
```bash
# Update all to 1.0.0
cd packages/core && npm version 1.0.0 --no-git-tag-version
cd ../admin && npm version 1.0.0 --no-git-tag-version
cd ../server && npm version 1.0.0 --no-git-tag-version
```

Or use script:
```bash
# In root
./scripts/version.sh 1.0.0
```

---

## Verify Before Publishing

```bash
# Check what will be published
cd packages/core
npm pack --dry-run

# Verify dist/ exists and is complete
ls -la dist/

# Check package.json exports
cat package.json | grep -A 10 exports
```

---

## Post-Publish

1. **Git tag**: `git tag v1.0.0 && git push --tags`
2. **Update CHANGELOG.md**
3. **Create GitHub release**
4. **Update docs** if needed

---

## Troubleshooting

**"403 Forbidden"**: Check npm access
```bash
npm whoami
npm access ls-packages @m14i
```

**"Package not found"**: Create organization first
```bash
npm org set @m14i <username> developer
```

**"Version already exists"**: Bump version
```bash
npm version patch
```

---

## Automated Publishing (Future)

Consider semantic-release for automated:
- Version bumping
- Changelog generation
- NPM publishing
- GitHub releases

Config in `.releaserc`:
```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github"
  ]
}
```
