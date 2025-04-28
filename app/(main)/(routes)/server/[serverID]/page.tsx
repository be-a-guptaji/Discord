// app/(main)/(routes)/server/[...serverID]/page.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ServerIDPage = async ({
  params,
}: {
  params: Promise<{ serverID: string }>;
}) => {
  // Fetch the current Profile of the user
  const profile = await getCurrentProfile();

  // If profile is NULL return to the signin page
  if (!profile) {
    return redirect("/sign-in");
  }

  // Get the server ID from the request parameters
  const { serverID } = await params;

  // Find the general channel ID of the server
  const server = await db.server.findUnique({
    where: {
      id: serverID,
      members: {
        some: {
          profileID: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  // Extract the first channel of the server (which is the general channel)
  const initialChannel = server?.channels[0];

  // If there is no general channel, return null
  if (initialChannel?.name !== "general") {
    return null;
  }

  // If there is a general channel, redirect to it
  return redirect(`/server/${serverID}/channel/${initialChannel.id}`);
};

export default ServerIDPage;
