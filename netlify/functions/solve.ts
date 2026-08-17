import type { Config, Context } from "@netlify/functions";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { questions, solves } from "../../db/schema";
import { getOrCreateProfile, json, requireUser } from "./_shared/auth";

export default async (_req: Request, context: Context) => {
  const { user, response } = await requireUser();
  if (!user || response) return response;

  const profile = await getOrCreateProfile({ id: user.id, email: user.email, name: user.name });
  const slug = context.params.slug;
  const [question] = await db.select().from(questions).where(eq(questions.slug, slug)).limit(1);
  if (!question) return json({ error: "Question not found." }, 404);
  if (question.isPlus && profile.plan !== "plus") {
    return json({ error: "Upgrade to Plus to solve this problem.", locked: true }, 403);
  }

  const [existing] = await db
    .select()
    .from(solves)
    .where(and(eq(solves.userId, user.id), eq(solves.questionId, question.id)))
    .limit(1);

  if (!existing) {
    await db.insert(solves).values({ userId: user.id, questionId: question.id });
  }

  return json({ ok: true, slug: question.slug, alreadySolved: Boolean(existing) });
};

export const config: Config = {
  path: "/api/questions/:slug/solve",
  method: "POST",
};
