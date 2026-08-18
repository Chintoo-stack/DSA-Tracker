import type { Config } from "@netlify/functions";
import OpenAI from "openai";
import { getOrCreateProfile, json, requireUser } from "./_shared/auth";

export default async (req: Request) => {
  const { user, response } = await requireUser();
  if (!user || response) return response;

  const profile = await getOrCreateProfile({ id: user.id, email: user.email, name: user.name });
  if (profile.plan !== "plus") {
    return json({ error: "The AI assistant is available on Ember Plus." }, 403);
  }

  const body = (await req.json().catch(() => ({}))) as {
    questionTitle?: string;
    prompt?: string;
    code?: string;
    message?: string;
  };

  const questionTitle = body.questionTitle?.trim();
  const message = body.message?.trim();
  if (!questionTitle || !message) {
    return json({ error: "Include the problem title and your question." }, 400);
  }

  const apiKey = Netlify.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return json({
      reply:
        "The AI assistant connects after this site’s first production deploy with Netlify AI Gateway enabled. Until then, restate the constraint, walk a tiny example, and check edge cases.",
    });
  }

  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are Ember, a concise DSA coach. Help the learner get unstuck. Do not dump a full drop-in solution unless they explicitly ask. Prefer hints, complexity notes, and the next step. Keep answers under 220 words.",
      },
      {
        role: "user",
        content: `Problem: ${questionTitle}\nStatement: ${body.prompt ?? ""}\nCurrent code:\n${body.code ?? "(none)"}\nLearner question: ${message}`,
      },
    ],
  });

  return json({ reply: completion.choices[0]?.message?.content ?? "I could not generate a hint just then. Try again." });
};

export const config: Config = {
  path: "/api/ai",
  method: "POST",
};
