import { getBlogClient } from "@/lib/blog-client";
import { createStatsHandler } from '@m14i/blogging-server';

export const GET = createStatsHandler(getBlogClient);
