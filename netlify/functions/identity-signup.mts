import type { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const { user } = JSON.parse(event.body || "{}") as {
    user?: { app_metadata?: Record<string, unknown> };
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        ...(user?.app_metadata ?? {}),
        roles: ["member"],
      },
    }),
  };
};

export { handler };
