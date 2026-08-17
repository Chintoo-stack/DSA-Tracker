import type { Config } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { questions, solves } from "../../db/schema";
import { FREE_QUESTION_COUNT, PLUS_QUESTION_COUNT, TOTAL_QUESTION_COUNT } from "../../src/data/catalog";
import { getOrCreateProfile, json, requireUser } from "./_shared/auth";

export default async () => {
  const { user, response } = await requireUser();
  if (!user || response) return response;

  const profile = await getOrCreateProfile({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  const plus = profile.plan === "plus";

  const userSolves = await db
    .select({
      questionId: solves.questionId,
      solvedAt: solves.solvedAt,
      isPlus: questions.isPlus,
    })
    .from(solves)
    .innerJoin(questions, eq(questions.id, solves.questionId))
    .where(eq(solves.userId, user.id))
    .orderBy(desc(solves.solvedAt));

  const visibleSolves = plus ? userSolves : userSolves.filter((row) => !row.isPlus);
  const solvedDates = [
    ...new Set(
      visibleSolves.map((row) => {
        const date = row.solvedAt instanceof Date ? row.solvedAt : new Date(row.solvedAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }),
    ),
  ];

  return json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? profile.name,
      plan: profile.plan,
    },
    progress: {
      solved: visibleSolves.length,
      total: plus ? TOTAL_QUESTION_COUNT : FREE_QUESTION_COUNT,
      plusUnlocked: PLUS_QUESTION_COUNT,
    },
    solvedQuestionIds: visibleSolves.map((row) => row.questionId),
    solvedDates,
  });
};

export const config: Config = {
  path: "/api/me",
  method: "GET",
};
