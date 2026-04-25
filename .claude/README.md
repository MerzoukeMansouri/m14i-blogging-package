# m14i-blogging Claude Skills

This directory contains Claude Code skills that assist with package integration and usage.

## Available Skills

### 📦 setup-blog

**Complete setup assistant for m14i-blogging integration**

This skill guides users through the entire process of integrating m14i-blogging into their Next.js application, from package installation to deploying a working blog.

**Activation:**
- "setup m14i-blogging"
- "install m14i-blogging"
- "help me integrate the blog"
- "add blog to my Next.js app"

**What it does:**
1. ✅ Verifies prerequisites (Next.js version, Supabase, etc.)
2. ✅ Guides through package installation
3. ✅ Sets up database migrations
4. ✅ Creates data access layer
5. ✅ Configures API routes
6. ✅ Sets up admin editor
7. ✅ Creates public blog pages
8. ✅ Configures authentication
9. ✅ Troubleshoots common issues

**Estimated time:** 30-60 minutes

**Output:** Fully functional blog with:
- Admin editor for creating posts
- Public pages for viewing posts
- API endpoints for CRUD operations
- Database with proper RLS policies
- Type-safe data access layer

## How to Use

### In Your Application

When you install m14i-blogging in your project, these skills become available automatically in Claude Code.

Simply ask Claude:
```
"Setup m14i-blogging in my app"
```

And the assistant will:
1. Ask about your current setup (Next.js version, design system, etc.)
2. Walk through each step of integration
3. Create all necessary files
4. Test functionality as you go
5. Fix any issues that arise

### Manual Activation

If you want to explicitly use the skill:

```bash
# In your project
npm install m14i-blogging

# Then ask Claude Code
"Use the m14i-blogging setup skill"
```

## Skill Features

### Intelligent Decision Making

The skill adapts to your setup:

**Design System Detection:**
- Has shadcn/ui? → Uses `BlogBuilder` with custom components
- No design system? → Uses `BlogBuilderWithDefaults`

**Next.js Version:**
- App Router → Modern async/await patterns
- Pages Router → getServerSideProps patterns

**Database:**
- Fresh install → Creates all tables
- Existing tables → Guides migration

### Step-by-Step Verification

After each step, the skill:
1. Creates the necessary files
2. Explains what was done
3. Suggests testing the functionality
4. Waits for confirmation before proceeding

### Proactive Troubleshooting

The skill anticipates common issues:
- Module resolution problems
- Tailwind configuration
- Database foreign key issues
- RLS policy conflicts
- TypeScript errors

## Customization

### For Package Maintainers

The skills are designed to be:
- **Version-aware:** Update when package versions change
- **Framework-agnostic:** Works with different Next.js setups
- **Extensible:** Easy to add new patterns and examples

### For Users

The skills respect your preferences:
- Asks before making changes
- Explains architectural decisions
- Provides alternatives when available
- Adapts to your coding style

## Contributing

To improve the skills:

1. **Add new patterns:** Edit `.claude/skills/setup-blog.md`
2. **Update examples:** Add to the integration guide
3. **Fix issues:** Submit PRs with troubleshooting updates
4. **Share feedback:** Open issues with improvement suggestions

## Documentation

### For Users
- [Integration Guide](../docs/INTEGRATION_GUIDE.md) - Complete manual setup
- [What's New](../docs/WHATS_NEW.md) - Latest features
- [README](../README.md) - Package overview
- [Storybook](https://merzoukemansouri.github.io/m14i-blogging-package) - Component demos

### For Contributors
- [Development Workflow](./DEVELOPMENT.md) - How to develop this package
- [Contributing Guide](../CONTRIBUTING.md) - Contribution guidelines
- [Release Process](../docs/RELEASE_PROCESS.md) - How releases work

## Support

If you encounter issues:

1. **Check the skill's troubleshooting section** - Most common issues are covered
2. **Ask Claude for help** - "Debug my m14i-blogging setup"
3. **Check documentation** - [Integration Guide](../docs/INTEGRATION_GUIDE.md)
4. **Open an issue** - [GitHub Issues](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues)

## Version Compatibility

| Package Version | Skill Version | Status |
|----------------|---------------|---------|
| 0.3.x          | 1.0.0        | ✅ Current |
| 0.2.x          | -            | ⚠️ Upgrade recommended |
| 0.1.x          | -            | ❌ Not supported |

## License

MIT - Same as the m14i-blogging package
