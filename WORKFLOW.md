# Workflow de mise à jour du package m14i-blogging

## 📦 Publication automatique

Ce package utilise **semantic-release** pour la publication automatique sur npm.

### Comment ça fonctionne

1. **Commit avec convention** : Utilisez les conventional commits
   - `feat:` → version mineure (0.x.0)
   - `fix:` → version patch (0.0.x)
   - `BREAKING CHANGE:` → version majeure (x.0.0)

2. **Push sur main** : La CI/CD GitHub Actions se déclenche automatiquement

3. **Publication automatique** : semantic-release :
   - Analyse les commits
   - Calcule la nouvelle version
   - Met à jour package.json et CHANGELOG.md
   - Publie sur npm
   - Crée un tag et une release GitHub

### Exemples de commits

```bash
# Nouvelle fonctionnalité (0.18.2 → 0.19.0)
git commit -m "feat: add drag and drop for sections"

# Correction de bug (0.18.2 → 0.18.3)
git commit -m "fix: resolve layout issue on mobile"

# Amélioration de performance (0.18.2 → 0.18.3)
git commit -m "perf: optimize image loading"

# Breaking change (0.18.2 → 1.0.0)
git commit -m "feat: redesign API

BREAKING CHANGE: change API signature"
```

## 🔄 Mise à jour dans les projets consommateurs (comme eckko)

Après qu'une nouvelle version soit publiée sur npm :

### Dans le projet eckko

```bash
cd /Users/mansouri/Projects/eckko/app
pnpm update m14i-blogging@latest
```

OU pour forcer une version spécifique :

```bash
pnpm install m14i-blogging@0.19.0
```

### Vérification

```bash
# Vérifier la version installée
pnpm list m14i-blogging

# Vérifier les versions disponibles
pnpm view m14i-blogging versions
```

## 🚀 Workflow complet

```bash
# 1. Dans m14i-blogging : faire des modifications
cd /Users/mansouri/Projects/m14i/m14i-blogging

# 2. Tester localement
pnpm build
pnpm storybook  # si besoin

# 3. Commit avec conventional commit
git add .
git commit -m "feat: add new feature X"

# 4. Push sur main → publication automatique
git push origin main

# 5. Attendre la CI/CD (1-2 minutes)
# Vérifier sur https://github.com/MerzoukeMansouri/m14i-blogging-package/actions

# 6. Dans eckko : mettre à jour
cd /Users/mansouri/Projects/eckko/app
pnpm update m14i-blogging@latest

# 7. Vérifier que tout fonctionne
pnpm dev
```

## ⚠️ Notes importantes

- **Ne jamais modifier manuellement** la version dans package.json
- **Toujours** utiliser les conventional commits
- **Attendre** que la CI/CD termine avant de mettre à jour dans eckko
- **Vérifier** le CHANGELOG.md généré automatiquement
- **Tester** dans Storybook avant de publier si c'est une modification majeure

## 🔍 Debugging

Si la publication échoue :

1. Vérifier les logs GitHub Actions
2. Vérifier que le token npm est valide (GitHub Secrets)
3. Vérifier que le commit respecte la convention
4. Vérifier qu'il n'y a pas de dépendances circulaires

## 📚 Ressources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Configuration actuelle](./.releaserc.json)
