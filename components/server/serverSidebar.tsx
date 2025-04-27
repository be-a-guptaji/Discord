// components/server/serverSidebar.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@/components/server/serverHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/serverSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from "lucide-react";

interface ServerSidebarProps {
  serverID: string;
}

// Mapping of channel types to icons
const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
};

// Mapping of member roles to icons
const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 size-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: <User className="mr-2 size-4 text-zinc-500" />,
};

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
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSearch
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Voice Channels",
                  type: "channel",
                  data: audioChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videoChannels?.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Members",
                  type: "member",
                  data: members?.map((member) => ({
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  })),
                },
              ]}
            />
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ServerSidebar;
