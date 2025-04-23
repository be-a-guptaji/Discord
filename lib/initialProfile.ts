// lib/initialProfile.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// This function retrieves the initial profile for the current user.
// If the user is not authenticated or does not have a profile, it redirects to the sign-in page.
export async function initialProfile() {
  // Get the current user from Clerk
  const user = await currentUser();

  // If the user is not authenticated, redirect to the sign-in page
  if (!user) {
    return null;
  }

  // Check if the user has a profile in the database
  const profile = await db.profile.findUnique({
    where: {
      userID: user.id,
    },
  });

  // If the user does not have a profile, redirect to the sign-in page
  if (profile) {
    return profile;
  }

  // If the user does not have a profile, create a new one in the database
  const newProfile = await db.profile.create({
    data: {
      userID: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0]?.emailAddress,
      imageURL: user.imageUrl,
    },
  });

  // Return the new profile
  if (newProfile) {
    return newProfile;
  }

  return null;
}
