import { getBlogClient } from "@/lib/blog-client";
import { checkAuth } from "@/lib/auth";
import { createMediaHandlers } from '@m14i/blogging-server';

const { GET, POST } = createMediaHandlers(getBlogClient, checkAuth);
export { GET, POST };
