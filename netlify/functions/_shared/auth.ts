import { getUser } from "@netlify/identity";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { profiles } from "../../db/schema";
import type { Plan } from "../../src/data/catalog";

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    return {
      user: null,
      response: json({ error: "Sign in to continue." }, 401),
    };
  }
  return { user, response: null };
}

export async function getOrCreateProfile(user: { id: string; email?: string | null; name?: string | null }) {
  const [existing] = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(profiles)
    .values({
      userId: user.id,
      email: user.email ?? null,
      name: user.name ?? null,
      plan: "free",
    })
    .returning();

  return created;
}

export function isPlusPlan(plan: string | null | undefined): boolean {
  return plan === "plus";
}

export function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export function parsePlan(value: unknown): Plan | null {
  if (value === "free" || value === "plus") return value;
  return null;
}
