// components/server/serverSidebar.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@/components/server/serverHeader";

interface ServerSidebarProps {
  serverID: string;
}

const ServerSidebar = async ({ serverID }: ServerSidebarProps) => {
  // Fetch the current profile
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // Fetch the server data using the serverID and profileID
  const server = await db.server.findUnique({
    where: {
      id: serverID,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  // Extract text channels from the server
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  // Extract audio channels from the server
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  // Extract video channels from the server
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // Extract members from the server
  const members = server?.members.filter(
    (member) => member.profileID !== profile.id
  );

  if (!server) {
    redirect("/");
  }

  // Find role in the server
  const role = server.members.find(
    (member) => member.profileID === profile.id
  )?.role;

  return (
    <>
      <div className="text-primary flex h-full w-full flex-col bg-[#F2F3F5] dark:bg-[#2B2D31]">
        <ServerHeader server={server} role={role} />
      </div>
    </>
  );
};

export default ServerSidebar;
