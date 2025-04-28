// app/(main)/(routes)/server/[serverID]/channel/[channelID]/page.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ChatHeader from "@/components/chat/chatHeader";

const ChannelIDPage = async ({
  params,
}: {
  params: Promise<{ channelID: string; serverID: string }>;
}) => {
  // Fetch the current Profile of the user
  const profile = await getCurrentProfile();

  // If profile is NULL return to the signin page
  if (!profile) {
    return redirect("/sign-in");
  }
  // Get the channel ID and server ID from the request parameters
  const { channelID, serverID } = await params;

  // Fetch channel using channelID
  const channel = await db.channel.findUnique({
    where: {
      id: channelID,
    },
  });

  // Find member using serverID and profileID
  const member = await db.member.findFirst({
    where: {
      serverID: serverID,
      profileID: profile.id,
    },
    include: {
      profile: true,
    },
  });

  // Redirect if channel or member is NULL
  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
        <ChatHeader
          serverID={channel.serverID}
          name={channel.name}
          type="channel"
        />
      </div>
    </>
  );
};

export default ChannelIDPage;
