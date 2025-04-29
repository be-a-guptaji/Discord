// app/(main)/(routes)/server/[serverID]/conversation/[memberID]/page.tsx

import ChatHeader from "@/components/chat/chatHeader";
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
  const member = await db.member.findUnique({
    where: {
      id: memberID,
    },
    include: {
      profile: true,
    },
  });

  // If member is NULL return to the server page
  if (!member) {
    return redirect(`/server/${serverID}`);
  }

  return (
    <>
      <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
        <ChatHeader
          serverID={serverID}
          name={member.profile.name}
          type="conversation"
          imageURL={member.profile.imageURL}
        />
      </div>
    </>
  );
};

export default MemberIDPage;
