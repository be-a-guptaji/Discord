// lib/currentProfile.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function getCurrentProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: { userID: userId },
  });

  return profile;
}
