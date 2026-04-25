# m14i-blogging Documentation

Complete documentation for m14i-blogging - Modular blog system for React/Next.js.

---

## 📦 Package Docs

- **[@m14i/blogging-core](../packages/core/README.md)** - Public blog components
- **[@m14i/blogging-admin](../packages/admin/README.md)** - CMS interface  
- **[@m14i/blogging-server](../packages/server/README.md)** - API utilities

---

## 🚀 Getting Started

- **[Installation Guide](./INSTALLATION.md)** - Package setup & configuration
- **[Quick Start](./QUICKSTART.md)** - 5-minute integration

---

## 📚 Feature Guides

- **[Blog Guide](./BLOG_GUIDE.md)** - Public blog usage
- **[Admin Guide](./BLOG_ADMIN_GUIDE.md)** - CMS setup & features
- **[SEO Guide](./SEO_GUIDE.md)** - SEO optimization
- **[Styling Guide](./STYLING.md)** - Theme customization
- **[Media Upload](./MEDIA_UPLOAD_GUIDE.md)** - File handling

---

## 🔧 Development

- **[Contributing](../CONTRIBUTING.md)** - Contribution guidelines
- **[Release Process](./RELEASE_PROCESS.md)** - Publishing workflow

---

## 📖 Additional Resources

- **[Fresh Install Guide](../INSTALL.md)** - Agent-readable integration guide
- **[Supabase Setup](../supabase/README.md)** - Database configuration
- **[Example App](../example/README.md)** - Working demo

---

## Package Architecture

```
@m14i/blogging-core          (Base)
     ↑          ↑
     |          |
@m14i/blogging-admin    @m14i/blogging-server
```

**Core** = Public UI + types + client  
**Admin** = Editor + CMS (uses core)  
**Server** = API + AI + SEO (uses core)  

---

## Quick Links

- **Repository**: https://github.com/MerzoukeMansouri/m14i-blogging-package
- **NPM**: https://www.npmjs.com/org/m14i
- **Issues**: https://github.com/MerzoukeMansouri/m14i-blogging-package/issues
- **Storybook**: https://merzoukemansouri.github.io/m14i-blogging-package
