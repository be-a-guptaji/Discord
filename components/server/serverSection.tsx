// components/server/serverSection.tsx

"use client";

import { ChannelType, MemberRole } from "@/lib/generated/prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";
import ActionToolTip from "@/components/actionToolTip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/useModal";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between py-2">
        <p className="text-xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">
          {label}
        </p>
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <>
            <ActionToolTip lable="Create Channel" side="top">
              <button
                onClick={() => onOpen("createChannel", { channelType })}
                className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                <Plus className="size-4" />
              </button>
            </ActionToolTip>
          </>
        )}
        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionToolTip lable="Manage Member" side="top">
            <button
              onClick={() => onOpen("members", { server })}
              className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              <Settings className="size-4" />
            </button>
          </ActionToolTip>
        )}
      </div>
    </>
  );
};

export default ServerSection;
