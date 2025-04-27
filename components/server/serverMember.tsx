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
    <ShieldCheck className="ml-auto size-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: <User className="ml-auto size-4 text-zinc-500" />,
};
const ServerMember = ({ member, server }: ServerMemberProps) => {
  // Navigation hook
  const router = useRouter();

  // Params hook
  const params = useParams();

  // Get the icon based on the member's role
  const icon = roleIconMap[member.role];

  return (
    <>
      <button
        className={cn(
          "group mb-2 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
          params?.memberID === member.id && "bg-zinc-700/20 dark:bg-zinc-700/60"
        )}
      >
        <div className="flex items-center gap-x-2">
          <UserAvatar src={member.profile?.imageURL} />
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-1 text-xs font-semibold">
              {member.profile?.name}
              {roleIconMap[member.role]}
            </div>
            <p className="text-xs text-zinc-500">{member.profile?.email}</p>
          </div>
        </div>
      </button>
    </>
  );
};

export default ServerMember;
