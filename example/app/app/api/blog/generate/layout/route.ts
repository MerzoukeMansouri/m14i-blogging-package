import { createAIContentGenerator } from '@m14i/blogging-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.prompt || typeof body.prompt !== "string") {
      return Response.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    const generator = createAIContentGenerator();
    const result = await generator.generateLayout(body);

    return Response.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("ANTHROPIC_API_KEY")) {
      return Response.json(
        { error: "AI service not configured. Please set ANTHROPIC_API_KEY environment variable." },
        { status: 500 }
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
