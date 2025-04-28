// app/(main)/(routes)/server/[...serverID]/page.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIDPageProps {
  params: {
    serverID: string;
  };
}

const ServerIDPage = async ({ params }: ServerIDPageProps) => {
  // Fetch the current Profile of the user
  const profile = await getCurrentProfile();

  // If profile is NULL return to the signin page
  if (!profile) {
    return redirect("/sign-in");
  }

  // Find the general channel ID of the server
  const server = await db.server.findUnique({
    where: {
      id: params.serverID,
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
  return redirect(`/server/${params.serverID}/channel/${initialChannel.id}`);
};

export default ServerIDPage;
