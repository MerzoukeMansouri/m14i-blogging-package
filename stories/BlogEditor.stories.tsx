import type { Meta, StoryObj } from "@storybook/react";
import { EditorView, BlogAdminProvider, BlogAdminAPIClient } from "@m14i/blogging-admin";

// Wrapper to provide context
function EditorWrapper() {
  const apiClient = new BlogAdminAPIClient("/api/blog");

  return (
    <BlogAdminProvider
      apiClient={apiClient}
      currentUser={{
        id: "demo-user",
        name: "Demo User",
        email: "demo@example.com",
      }}
      basePath="/admin/blog"
    >
      <div className="min-h-screen bg-background">
        <EditorView />
      </div>
    </BlogAdminProvider>
  );
}

const meta = {
  title: "Admin/Blog Editor",
  component: EditorView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EditorView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullEditor: Story = {
  render: () => <EditorWrapper />,
  parameters: {
    docs: {
      description: {
        story: `
Full blog post editor with:
- Title and excerpt input
- Category and tag management
- Drag & drop layout builder (Cmd/Ctrl+L to toggle layer panel)
- AI assistant panel (Cmd/Ctrl+I to toggle)
- Content block editing (text, images, code, quotes, etc.)
- SEO metadata
- Save draft / publish workflow

**Keyboard Shortcuts:**
- Cmd/Ctrl+L: Toggle layer panel
- Cmd/Ctrl+I: Toggle AI panel
        `,
      },
    },
  },
};
