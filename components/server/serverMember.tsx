// components/server/serverMember.tsx

"use client";

import {
  Member,
  MemberRole,
  Profile,
  Server,
} from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "@/components/userAvatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

// Mapping of member roles to icons
const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="ml-auto size-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="absolute right-6 size-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: <User className="ml-auto size-4 text-zinc-500" />,
};
const ServerMember = ({ member, server }: ServerMemberProps) => {
  // Navigation hook
  const router = useRouter();

  // Params hook
  const params = useParams();

  // Function to Redirect to the conversation page
  const onClick = () => {
    router.push(`/server/${params?.serverID}/conversation/${member.id}`);
  };

  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          "group mb-2 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
          params?.memberID === member.id && "bg-zinc-700/20 dark:bg-zinc-700/60"
        )}
      >
        <div className="flex items-center gap-x-2">
          <UserAvatar src={member.profile?.imageURL} className="size-8" />
          <p
            className={cn(
              "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
              params?.memberID === member.id &&
                "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
          >
            {member.profile?.name}
          </p>
          {roleIconMap[member.role]}
        </div>
      </button>
    </>
  );
};

export default ServerMember;
