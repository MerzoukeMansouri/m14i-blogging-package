import type { Metadata } from "next";
import "./globals.css";
import "m14i-blogging/styles";

export const metadata: Metadata = {
  title: "m14i-blogging Example",
  description: "Full blog example with m14i-blogging and self-hosted Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
