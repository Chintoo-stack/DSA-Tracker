import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { profiles } from "../../db/schema";
import { getOrCreateProfile, json, parsePlan, requireUser } from "./_shared/auth";

export default async (req: Request) => {
  const { user, response } = await requireUser();
  if (!user || response) return response;

  const body = (await req.json().catch(() => ({}))) as { plan?: unknown };
  const plan = parsePlan(body.plan);
  if (!plan) return json({ error: "Plan must be free or plus." }, 400);

  await getOrCreateProfile({ id: user.id, email: user.email, name: user.name });
  const [updated] = await db.update(profiles).set({ plan }).where(eq(profiles.userId, user.id)).returning();

  return json({ plan: updated.plan });
};

export const config: Config = {
  path: "/api/plan",
  method: "POST",
};
