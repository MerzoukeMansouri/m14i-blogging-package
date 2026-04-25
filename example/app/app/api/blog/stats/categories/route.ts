import { getBlogClient } from "@/lib/blog-client";
import { createCategoriesHandler } from '@m14i/blogging-server';

export const GET = createCategoriesHandler(getBlogClient);
