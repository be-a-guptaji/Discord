// app/(invite)/(routes)/invite/[inviteCode]/page.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  // Fetch the current profile
  const profile = await getCurrentProfile();

  // Check if the profile is null or undefined
  if (!profile) {
    return redirect("/");
  }

  // Extract the inviteCode from the params
  const { inviteCode } = await params;

  // Check if the inviteCode is null or undefined
  if (!inviteCode) {
    return redirect("/");
  }

  // Check if user already exists in the server
  const existingInServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileID: profile.id,
        },
      },
    },
  });

  // If the user already exists in the server, redirect to the server page
  if (existingInServer) {
    return redirect(`/server/${existingInServer.id}`);
  }

  try {
    // Check if the server with the given inviteCode exists
    const server = await db.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileID: profile.id,
            },
          ],
        },
      },
    });

    // If the server with the given inviteCode exist, redirect to the home page
    if (server) {
      return redirect(`/server/${server.id}`);
    }
  } catch (error) {
    // Handle the case where the server with the given inviteCode does not exist
    console.error("Error no server found:", error);
    return redirect("/"); // Redirect to home page if the server does not exist
  }

  return null; // Return null if no redirection occurs
};

export default InviteCodePage;
