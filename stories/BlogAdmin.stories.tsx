import type { Meta, StoryObj } from "@storybook/react";
import { BlogAdmin } from "@m14i/blogging-admin";

const meta = {
  title: "Admin/BlogAdmin",
  component: BlogAdmin,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BlogAdmin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    basePath: "/admin/blog",
    apiBasePath: "/api/blog",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key",
    currentUser: {
      id: "00000000-0000-0000-0000-000000000000",
      name: "Demo User",
      email: "demo@example.com",
      role: "admin",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Full BlogAdmin interface with post listing, editor, and preview capabilities.",
      },
    },
  },
};

export const ReadOnlyUser: Story = {
  args: {
    basePath: "/admin/blog",
    apiBasePath: "/api/blog",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key",
    currentUser: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Viewer",
      email: "viewer@example.com",
      role: "viewer",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "BlogAdmin interface for users with view-only permissions.",
      },
    },
  },
};
