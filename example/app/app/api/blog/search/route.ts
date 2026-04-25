import { getBlogClient } from "@/lib/blog-client";
import { createSearchPostsHandler } from '@m14i/blogging-server';

export const GET = createSearchPostsHandler(getBlogClient);
