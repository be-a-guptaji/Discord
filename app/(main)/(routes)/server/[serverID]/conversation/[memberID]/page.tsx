// app/(main)/(routes)/server/[serverID]/conversation/[memberID]/page.tsx

import ChatHeader from "@/components/chat/chatHeader";
import ChatInput from "@/components/chat/chatInput";
import ChatMessages from "@/components/chat/chatMessage";
import MediaRoom from "@/components/mediaRoom";
import { getOrCreateConversation } from "@/lib/conversation";
import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIDPageProps {
  params: Promise<{
    memberID: string;
    serverID: string;
  }>;
  searchParams: Promise<{ video?: string | null | undefined }>;
}

const MemberIDPage = async ({ params, searchParams }: MemberIDPageProps) => {
  // Fetch the current Profile of the user
  const profile = await getCurrentProfile();

  // If profile is NULL return to the signin page
  if (!profile) {
    return redirect("/sign-in");
  }

  // Get the member ID and server ID from the request parameters
  const { memberID, serverID } = await params;

  // Get the video from the searchParams
  const { video } = await searchParams;

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
        {video && (
          <>
            <MediaRoom chatID={conversation.id} audio video />
          </>
        )}
        {!video && (
          <>
            <ChatMessages
              name={otherMember.profile.name}
              member={currentMember}
              chatID={conversation.id}
              apiURL="/api/directMessages"
              socketURL="/api/socket/directMessages"
              socketQuery={{ conversationID: conversation.id }}
              paramValue={conversation.id}
              paramKey="conversationID"
              type="conversation"
            />
            <ChatInput
              name={otherMember.profile.name}
              apiURL="/api/socket/directMessages"
              query={{ conversationID: conversation.id }}
              type="conversation"
            />
          </>
        )}
      </div>
    </>
  );
};

export default MemberIDPage;
