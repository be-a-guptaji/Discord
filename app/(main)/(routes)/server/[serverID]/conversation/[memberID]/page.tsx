// app/(main)/(routes)/server/[serverID]/conversation/[memberID]/page.tsx

import ChatHeader from "@/components/chat/chatHeader";
import { getOrCreateConversation } from "@/lib/conversation";
import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const MemberIDPage = async ({
  params,
}: {
  params: Promise<{ memberID: string; serverID: string }>;
}) => {
  // Fetch the current Profile of the user
  const profile = await getCurrentProfile();

  // If profile is NULL return to the signin page
  if (!profile) {
    return redirect("/sign-in");
  }

  // Get the member ID and server ID from the request parameters
  const { memberID, serverID } = await params;

  // Fetch the member Profile
  const currentMember = await db.member.findFirst({
    where: {
      serverID: serverID,
      profileID: profile.id,
    },
    include: {
      profile: true,
    },
  });

  // If member is NULL return to the server page
  if (!currentMember) {
    return redirect("/");
  }

  // Get the conversation member
  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberID
  );

  // If conversation is NULL return to the server page
  if (!conversation) {
    return redirect(`/server/${serverID}`);
  }

  // Extract the memberOne and memberTwo from the conversation
  const { memberOne, memberTwo } = conversation;

  // Get the other member
  const otherMember =
    memberOne.profileID === profile.id ? memberTwo : memberOne;

  return (
    <>
      <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
        <ChatHeader
          serverID={serverID}
          name={otherMember.profile.name}
          type="conversation"
          imageURL={otherMember.profile.imageURL}
        />
      </div>
    </>
  );
};

export default MemberIDPage;
