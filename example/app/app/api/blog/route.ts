import { getBlogClient } from "@/lib/blog-client";
import { checkAuth } from "@/lib/auth";
import {
  createListPostsHandler,
  createCreatePostHandler,
} from '@m14i/blogging-server';

export const GET = createListPostsHandler(getBlogClient);
export const POST = createCreatePostHandler(getBlogClient, checkAuth);
