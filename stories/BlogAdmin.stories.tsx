import type { Meta, StoryObj } from "@storybook/react";
import { BlogAdmin } from "@m14i/blogging-admin";

const meta = {
  title: "Admin/BlogAdmin",
  component: BlogAdmin,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "BlogAdmin component requires a live Supabase instance. This is a documentation-only story. For a working demo, run the example app locally.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogAdmin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Documentation: Story = {
  args: {
    isAllowed: true,
    currentUser: {
      id: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## Setup Instructions

To use BlogAdmin in your application:

\`\`\`tsx
import { BlogAdmin } from "@m14i/blogging-admin";

<BlogAdmin
  isAllowed={user?.role === "admin"}
  currentUser={{
    id: user.id,
    name: user.name,
    email: user.email,
  }}
  basePath="/admin/blog"
  apiBasePath="/api/blog"
/>
\`\`\`

## Features

- Post listing with search and filters
- WYSIWYG editor with drag-and-drop layout builder
- AI-powered content generation
- Preview mode
- Media management
- SEO optimization tools

## Access Control

Pass \`isAllowed={true}\` to grant access. Typically you'd check user permissions:

\`\`\`tsx
<BlogAdmin
  isAllowed={user?.role === "admin" || user?.role === "editor"}
  currentUser={user}
/>
\`\`\`

## Note

This component requires:
- API routes set up for blog operations
- User authentication system
- Optional: Supabase for backend storage

See the [installation guide](./?path=/docs/getting-started-installation--docs) for complete setup instructions.
        `,
      },
    },
  },
};
