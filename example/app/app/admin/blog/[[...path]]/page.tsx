"use client";

import dynamic from "next/dynamic";
import { BlogBuilderWithDefaults } from "@m14i/blogging-admin";
import type { LayoutSection } from "@m14i/blogging-core";

const BlogAdmin = dynamic(
  () => import("@m14i/blogging-admin").then((m) => m.BlogAdmin),
  { ssr: false },
);

// Wrapper to match BlogAdmin's expected interface
function BlogBuilderWrapper({
  sections,
  onChange,
  generatingSections,
}: {
  sections: LayoutSection[];
  onChange: (sections: LayoutSection[]) => void;
  generatingSections?: Set<string>;
}) {
  return (
    <BlogBuilderWithDefaults
      sections={sections}
      onChange={onChange}
      generatingSections={generatingSections}
      components={{} as any}
    />
  );
}

export default function BlogAdminPage() {
  return (
    <BlogAdmin
      isAllowed={true}
      currentUser={{
        id: "00000000-0000-0000-0000-000000000000",  // Valid UUID for demo
        name: "Admin",
        email: "admin@example.com"
      }}
      basePath="/admin/blog"
      apiBasePath="/api/blog"
      components={{
        BlogBuilder: BlogBuilderWrapper,
      }}
    />
  );
}
