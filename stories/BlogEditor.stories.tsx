import type { Meta, StoryObj } from "@storybook/react";
import { BlogAdmin } from "@m14i/blogging-admin";

const meta = {
  title: "Admin/Blog Editor",
  component: BlogAdmin,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogAdmin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullEditor: Story = {
  args: {
    isAllowed: true,
    currentUser: {
      id: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
    },
    basePath: "/admin/blog",
    apiBasePath: "/api/blog",
  },
  parameters: {
    docs: {
      description: {
        story: `
Full blog editor with:
- Title and taxonomy (categories/tags) editing
- Drag & drop layout builder (Cmd/Ctrl+L to toggle)
- AI assistant panel (Cmd/Ctrl+I to toggle)
- Content block editing
- SEO metadata
- Save/publish workflow

**Keyboard Shortcuts:**
- Cmd/Ctrl+L: Toggle layer panel
- Cmd/Ctrl+I: Toggle AI panel
        `,
      },
    },
  },
};
