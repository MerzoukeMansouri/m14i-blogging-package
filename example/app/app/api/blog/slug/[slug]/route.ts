import { getBlogClient } from "@/lib/blog-client";
import { createGetPostBySlugHandler } from '@m14i/blogging-server';

export const GET = createGetPostBySlugHandler(getBlogClient);
