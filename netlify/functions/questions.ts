import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { questions, solves } from "../../db/schema";
import { getOrCreateProfile, json, requireUser } from "./_shared/auth";

export default async (req: Request, context: Context) => {
  const { user, response } = await requireUser();
  if (!user || response) return response;

  const profile = await getOrCreateProfile({ id: user.id, email: user.email, name: user.name });
  const plus = profile.plan === "plus";
  const slug = context.params.slug;

  const userSolves = await db.select().from(solves).where(eq(solves.userId, user.id));
  const solvedIds = new Set(userSolves.map((row) => row.questionId));

  if (slug) {
    const [question] = await db.select().from(questions).where(eq(questions.slug, slug)).limit(1);
    if (!question) return json({ error: "Question not found." }, 404);
    if (question.isPlus && !plus) {
      return json({ error: "This problem is included with Ember Plus.", locked: true }, 403);
    }
    return json({
      question: {
        ...question,
        solved: solvedIds.has(question.id),
      },
    });
  }

  const all = await db.select().from(questions);
  const visible = plus ? all : all.filter((row) => !row.isPlus);
  return json({
    questions: visible.map((question) => ({
      id: question.id,
      slug: question.slug,
      title: question.title,
      difficulty: question.difficulty,
      topic: question.topic,
      isPlus: question.isPlus,
      solved: solvedIds.has(question.id),
    })),
  });
};

export const config: Config = {
  path: ["/api/questions", "/api/questions/:slug"],
  method: "GET",
};
