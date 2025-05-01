// components/chat/chatItem.tsx

"use client";

import { Member, MemberRole, Profile } from "@/lib/generated/prisma/client";
import UserAvatar from "@/components/userAvatar";
import ActionToolTip from "@/components/actionToolTip";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileURL: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketURL: string;
  socketQuery: Record<string, string>;
}

// Mapping of member roles to icons
const roleIconMap = {
  [MemberRole.GUEST]: <User className="ml-2 size-4 text-gray-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileURL,
  deleted,
  currentMember,
  isUpdated,
  socketURL,
  socketQuery,
}: ChatItemProps) => {
  // Check if the current member is an admin
  const isAdmin = currentMember.role === MemberRole.ADMIN;

  // Check if the current member is a moderator
  const isModerator = currentMember.role === MemberRole.MODERATOR;

  // Check if the current member is the author of the message
  const isOwner = currentMember.id === member.id;

  // Check if the current member is the author of the message or an admin or a moderator
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);

  // Check if the current member is the author of the message to edit
  const canEditMessage = !deleted && isOwner && !fileURL;

  return (
    <>
      <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
        <div className="group flex w-full items-start gap-x-2">
          <div className="cursor-pointer transition hover:drop-shadow-md">
            <UserAvatar src={member.profile.imageURL} />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p className="mx-2 cursor-pointer text-sm font-semibold hover:underline">
                  {member.profile.name}
                </p>
                <ActionToolTip lable={member.role} side="right" align="center">
                  {roleIconMap[member.role]}
                </ActionToolTip>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {timestamp}
              </span>
            </div>
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatItem;
