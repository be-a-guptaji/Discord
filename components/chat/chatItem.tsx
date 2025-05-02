// components/chat/chatItem.tsx

"use client";

import { Member, MemberRole, Profile } from "@/lib/generated/prisma/client";
import UserAvatar from "@/components/userAvatar";
import ActionToolTip from "@/components/actionToolTip";
import { FileIcon, Mic, ShieldAlert, ShieldCheck, User } from "lucide-react";
import Image from "next/image";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileURL: string | null;
  fileType: string | null;
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
  fileType,
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
      <div className="group relative my-4 flex w-full items-center p-4 transition hover:bg-black/5">
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

            {fileType === "pdf" && fileURL && (
              <>
                <div className="bg-background/10 relative mt-2 flex h-16 w-48 items-center rounded-md">
                  <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-full items-center justify-center gap-x-6 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
                  >
                    <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
                    <p className="truncate text-wrap">PDF File</p>
                  </a>
                </div>
              </>
            )}

            {fileType === "mp3" && fileURL && (
              <>
                <div className="bg-background/10 relative mt-2 flex w-fit items-center rounded-md p-2">
                  <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-sm text-indigo-500 hover:underline dark:text-indigo-400"
                  >
                    <Mic className="size-10 fill-indigo-200 stroke-indigo-400" />
                    <audio controls src={fileURL} />
                  </a>
                </div>
              </>
            )}

            {fileType === "mp4" && fileURL && (
              <>
                <div className="bg-background/10 relative mt-2 flex size-fit items-center rounded-md p-2">
                  <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-sm text-indigo-500 hover:underline dark:text-indigo-400"
                  >
                    <video
                      src={fileURL}
                      className="aspect-video w-[390px] rounded-md"
                      autoPlay={true}
                      muted
                      controls
                    />
                  </a>
                </div>
              </>
            )}

            {fileType &&
              !["pdf", "mp3", "mp4"].includes(fileType) &&
              fileURL && (
                <a
                  href={fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary relative mt-2 flex aspect-square size-48 items-center overflow-hidden rounded-md border"
                >
                  <Image
                    fill
                    priority
                    src={fileURL}
                    alt={fileType}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </a>
              )}

            {content && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {content}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatItem;
