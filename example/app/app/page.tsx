import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">m14i-blogging Example</h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        A complete blog management system powered by m14i-blogging and
        self-hosted Supabase.
      </p>
      <div className="flex gap-4">
        <Link
          href="/blog"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Blog
        </Link>
        <Link
          href="/admin/blog"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Admin Panel
        </Link>
      </div>
      <div className="mt-8 text-sm text-gray-500 space-y-1 text-center">
        <p>
          Supabase Studio:{" "}
          <a
            href="http://localhost:3001"
            className="text-blue-600 underline"
            target="_blank"
          >
            localhost:3001
          </a>
        </p>
        <p>
          Supabase API:{" "}
          <a
            href="http://localhost:8000"
            className="text-blue-600 underline"
            target="_blank"
          >
            localhost:8000
          </a>
        </p>
      </div>
    </main>
  );
}
