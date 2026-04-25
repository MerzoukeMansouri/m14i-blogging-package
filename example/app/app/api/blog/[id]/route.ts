import { NextRequest, NextResponse } from "next/server";
import { getBlogClient } from "@/lib/blog-client";
import { checkAuth } from "@/lib/auth";
import {
  createUpdatePostHandler,
  createDeletePostHandler,
} from '@m14i/blogging-server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const blog = await getBlogClient();
    const post = await blog.posts.getById(id);
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}

export const PATCH = createUpdatePostHandler(getBlogClient, checkAuth);
export const DELETE = createDeletePostHandler(getBlogClient, checkAuth);
