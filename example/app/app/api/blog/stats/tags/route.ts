import { getBlogClient } from "@/lib/blog-client";
import { createTagsHandler } from '@m14i/blogging-server';

export const GET = createTagsHandler(getBlogClient);
