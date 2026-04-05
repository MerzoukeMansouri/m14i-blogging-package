# BlogAdmin Storybook Documentation

This directory contains **fully interactive** Storybook stories for the BlogAdmin component.

## 🎮 Interactive Features

Unlike typical Storybook stories, these are **fully functional**! Each story includes a **yellow navigation toolbar** at the top of the screen.

### Navigation Toolbar

Use the toolbar buttons to navigate between views:
- **List** → View all posts with filtering/search
- **New Post** → Create a new post with BlogBuilder
- **Edit Post 1** → Edit an existing post

### Within Each View

- ✅ **Fill out forms** - All inputs work
- ✅ **Use BlogBuilder** - Drag and drop content blocks
- ✅ **Create categories/tags** - Click "+ Nouvelle catégorie" or "+ Nouveau tag"
- ✅ **Delete posts** - With confirmation dialogs
- ✅ **Filter and search** - In list view
- ✅ **Auto-save** - Changes saved to sessionStorage
- ✅ **Save/Publish** - Buttons create/update posts in mock data

**Note:** Due to Storybook limitations, use the yellow toolbar to navigate between views. All other interactions (forms, dialogs, buttons) work normally.

## Running Storybook

```bash
pnpm storybook
```

Then navigate to the "Admin/BlogAdmin" category in the sidebar.

## Available Stories

### 1. Default
The standard BlogAdmin interface with all features enabled:
- Posts list view
- Full CRUD operations
- Categories and tags management
- SEO fields
- Auto-save
- Preview functionality

### 2. Access Denied
Demonstrates the security UI when `isAllowed={false}`:
- Shows access denied message
- Polite error screen
- No admin functionality exposed

### 3. English Labels
Complete i18n example with English labels instead of default French:
- All UI text in English
- Demonstrates customization capabilities
- Shows how to override any label

### 4. Minimal Features
Stripped-down version with only essential features:
- No categories or tags
- No SEO fields
- No featured images
- Just core content editing

### 5. With Callbacks
Demonstrates lifecycle event integration:
- `onPostCreate` - Fired when a post is created
- `onPostUpdate` - Fired when a post is updated
- `onPostDelete` - Fired when a post is deleted
- `onPublish` - Fired when a post is published
- Shows console logs and alerts for each event

### 6. Dark Theme
Dark mode demonstration:
- Uses Tailwind dark mode
- Shows theming capabilities
- Maintains full functionality

### 7. Content Creator Mode
Simplified interface for writers:
- No taxonomy management
- Focus on content creation
- Preview-first workflow
- Custom labels in French

## Mock Data

The stories use a mock API client (`MockBlogAdminAPIClient`) with sample data:

- **Posts**: 3 sample posts (2 published, 1 draft)
- **Categories**: Tutorials, Advanced, News
- **Tags**: react, typescript, javascript, web development, patterns, architecture

The mock client simulates network delays (500ms) for realistic UX testing.

## Component Props

Key props demonstrated in stories:

```typescript
interface BlogAdminProps {
  isAllowed: boolean;              // Security control
  currentUser?: CurrentUser;       // User info
  apiBasePath?: string;            // API endpoint
  apiClient?: any;                 // Custom API client (for testing)
  basePath?: string;               // Internal routing base
  theme?: "light" | "dark";        // Theme preference
  features?: {                     // Feature toggles
    categories?: boolean;
    tags?: boolean;
    seo?: boolean;
    autoSave?: boolean;
    preview?: boolean;
    featuredImage?: boolean;
  };
  labels?: Partial<BlogAdminLabels>; // i18n customization
  components?: {                   // shadcn/ui components
    Button, Input, Card, Badge,
    Dialog, Select, BlogBuilder
  };
  onPostCreate?: (post) => void;   // Lifecycle callbacks
  onPostUpdate?: (post) => void;
  onPostDelete?: (id) => void;
  onPublish?: (post) => void;
}
```

## Navigation Toolbar

Each story includes a **yellow navigation toolbar** at the top showing:
- Quick navigation buttons (List, New Post, Edit Post 1)
- Current route state (list/create/edit/preview)
- Current post ID (when editing)

This provides easy navigation within Storybook and helps you understand the current state.

## Testing Workflow

Use Storybook to:

1. **Visual Testing** - Verify UI looks correct across different states
2. **Interaction Testing** - Test CRUD operations with mock data
3. **Navigation Testing** - Click through all views (list → create → edit → preview)
4. **Accessibility Testing** - Use Storybook a11y addon
5. **Responsive Testing** - Use viewport addon to test mobile/tablet
6. **Theme Testing** - Switch between light/dark modes
7. **i18n Testing** - Verify label customization works

## Routing Implementation

The interactive routing is handled by `BlogAdminWrapper` (`mocks/BlogAdminWrapper.tsx`):

### How It Works

1. **React State Routing** - Uses React state to manage current view
   - State: `{ view: "list" | "create" | "edit" | "preview", params?: {...} }`
   - Navigation toolbar buttons update this state
   - View re-renders when state changes

2. **Navigation Toolbar** - Yellow toolbar at top provides navigation
   - "List" → Sets view to "list"
   - "New Post" → Sets view to "create"
   - "Edit Post 1" → Sets view to "edit" with id "post-1"
   - Current route displayed in toolbar

3. **Method Overriding** - Intercepts `window.location.assign/replace`
   - Overrides these methods to detect admin URLs
   - Routes internally when URL contains "/admin/blog"
   - Falls back to original methods for non-admin URLs

### Why This Approach?

- ✅ Works reliably in Storybook
- ✅ No page reloads
- ✅ Simple to understand
- ✅ All form interactions work normally
- ⚠️ Navigation clicks require toolbar (can't intercept href assignments)

This is a **Storybook-specific** solution. In production, the real BlogAdmin component uses normal URL-based routing.

## Mock API Client

Located in `mocks/blog-admin-api.ts`, the mock client:

- Stores data in memory (resets on page reload)
- Simulates network latency (500ms)
- Implements full BlogAdminAPIClient interface
- Returns realistic response formats
- Handles filtering, pagination, and search

## Adding New Stories

To add a new story:

1. Import necessary components
2. Create a new export with Story type
3. Add JSDoc comment describing the story
4. Pass `apiClient={mockApiClient}` for mock data
5. Configure props to demonstrate specific feature

Example:

```typescript
/**
 * Your story description here
 */
export const YourStory: Story = {
  render: () => (
    <BlogAdmin
      isAllowed={true}
      apiClient={mockApiClient}
      // ... your custom props
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};
```

## Troubleshooting

### Story doesn't load
- Check console for errors
- Verify all required components are passed
- Ensure BlogBuilder is included in components prop

### Mock data not showing
- Verify `apiClient={mockApiClient}` is passed
- Check browser console for API errors
- Refresh Storybook

### Styles not applied
- Ensure Tailwind CSS is configured in `.storybook/preview.ts`
- Check that component styles are imported
- Verify CSS custom properties are defined

## Related Files

- `mocks/shadcn-components.tsx` - Mock UI components
- `mocks/blog-admin-api.ts` - Mock API client with data
- `../src/admin/` - BlogAdmin source code
- `../docs/BLOG_ADMIN_GUIDE.md` - Full integration guide
