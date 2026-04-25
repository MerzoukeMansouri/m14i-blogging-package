import { redirect } from "next/navigation";

export default async function LegacyPreviewPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const slug = path?.join("/") || "";
  redirect(`/admin/blog/preview/${slug}`);
}
