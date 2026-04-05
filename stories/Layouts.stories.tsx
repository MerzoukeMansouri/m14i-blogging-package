import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { GridLayout } from "../src/public/components/layouts/GridLayout";
import { ListLayout } from "../src/public/components/layouts/ListLayout";
import { MasonryLayout } from "../src/public/components/layouts/MasonryLayout";
import { MagazineLayout } from "../src/public/components/layouts/MagazineLayout";
import { mockPosts } from "./mockData";

// Grid Layout Stories
const gridMeta: Meta<typeof GridLayout> = {
  title: "Public/Layouts/GridLayout",
  component: GridLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog">
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export default gridMeta;
type GridStory = StoryObj<typeof GridLayout>;

export const GridDefault: GridStory = {
  args: {
    posts: mockPosts.slice(0, 6),
  },
};

export const GridFewPosts: GridStory = {
  args: {
    posts: mockPosts.slice(0, 2),
  },
};

export const GridManyPosts: GridStory = {
  args: {
    posts: mockPosts,
  },
};

// List Layout Stories
const listMeta: Meta<typeof ListLayout> = {
  title: "Public/Layouts/ListLayout",
  component: ListLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog">
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export const ListDefault: StoryObj<typeof ListLayout> = {
  ...listMeta,
  args: {
    posts: mockPosts.slice(0, 5),
  },
};

export const ListFewPosts: StoryObj<typeof ListLayout> = {
  ...listMeta,
  args: {
    posts: mockPosts.slice(0, 2),
  },
};

// Masonry Layout Stories
const masonryMeta: Meta<typeof MasonryLayout> = {
  title: "Public/Layouts/MasonryLayout",
  component: MasonryLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog">
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export const MasonryDefault: StoryObj<typeof MasonryLayout> = {
  ...masonryMeta,
  args: {
    posts: mockPosts.slice(0, 9),
  },
};

export const MasonryManyPosts: StoryObj<typeof MasonryLayout> = {
  ...masonryMeta,
  args: {
    posts: mockPosts,
  },
};

// Magazine Layout Stories
const magazineMeta: Meta<typeof MagazineLayout> = {
  title: "Public/Layouts/MagazineLayout",
  component: MagazineLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog">
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export const MagazineDefault: StoryObj<typeof MagazineLayout> = {
  ...magazineMeta,
  args: {
    posts: mockPosts.slice(0, 7),
  },
};

export const MagazineFeaturedOnly: StoryObj<typeof MagazineLayout> = {
  ...magazineMeta,
  args: {
    posts: mockPosts.slice(0, 1),
  },
};

export const MagazineManyPosts: StoryObj<typeof MagazineLayout> = {
  ...magazineMeta,
  args: {
    posts: mockPosts,
  },
};
