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
  parameters: {
    docs: {
      description: {
        story: `
## Setup Instructions

To use BlogAdmin in your application:

\`\`\`tsx
import { BlogAdmin } from "@m14i/blogging-admin";

<BlogAdmin
  basePath="/admin/blog"
  apiBasePath="/api/blog"
  supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
  supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
  currentUser={{
    id: user.id,
    name: user.name,
    email: user.email,
    role: "admin"
  }}
/>
\`\`\`

## Features

- Post listing with search and filters
- WYSIWYG editor with drag-and-drop layout builder
- AI-powered content generation
- Preview mode
- Media management
- SEO optimization tools

## Note

This component requires:
- Supabase instance configured
- API routes set up
- User authentication

See the [installation guide](./?path=/docs/getting-started-installation--docs) for complete setup instructions.
        `,
      },
    },
  },
};
