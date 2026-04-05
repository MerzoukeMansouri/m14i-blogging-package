import type { Preview } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Getting Started',
          ['Welcome'],
          'Complete Examples',
          ['Real-World Blogs'],
          'Core Components',
          ['BlogPreview', 'BlogBuilder', 'BlogBuilder with Preview'],
          'Content Blocks',
          ['Carousel', 'PDF'],
          'Layouts',
          ['Gallery Grids'],
          'Theming',
          ['CSS Variables', 'ClassName Props', 'Theme Playground'],
          'Advanced Use Cases',
          ['Feature Combinations'],
          'SEO',
          ['BlogSEO'],
        ],
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
