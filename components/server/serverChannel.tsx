// componets/server/serverChannel.tsx

"use client";

import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import {
  Channel,
  ChannelType,
  MemberRole,
  Server,
} from "@/lib/generated/prisma/client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionToolTip from "@/components/actionToolTip";
import { ModalType, useModal } from "@/hooks/useModal";

interface ServerChannelProps {
  role?: MemberRole;
  channel: Channel;
  server: Server;
}

// Mapping of channel types to icons
const iconMap = {
  [ChannelType.TEXT]: (
    <Hash className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Mic className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
  ),
};

const ServerChannel = ({ role, channel, server }: ServerChannelProps) => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { onOpen } = useModal();

  // Navigation hook
  const router = useRouter();

  // Params hook
  const params = useParams();

  // Mapping of channel types to icons
  const icon = iconMap[channel.type];

  // Function to redirect to the channel page
  const onClick = () => {
    router.push(`/server/${server.id}/channel/${channel.id}`);
  };

  // Function to prevent opening page on edit and delete
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();

    // Open the Modal
    onOpen(action, { channel, server });
  };

  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          "group mb-2 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
          params?.channelID === channel.id &&
            "bg-zinc-700/20 dark:bg-zinc-700/60"
        )}
      >
        {icon}
        <p
          className={cn(
            "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
            params?.channelID === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <>
            <div className="ml-auto flex items-center gap-x-2">
              <ActionToolTip lable="Edit">
                <Edit
                  onClick={(e) => onAction(e, "editChannel")}
                  className="hidden size-4 text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                />
              </ActionToolTip>
              <ActionToolTip lable="Delete">
                <Trash
                  onClick={(e) => onAction(e, "deleteChannel")}
                  className="hidden size-4 text-rose-500 transition group-hover:block hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-500"
                />
              </ActionToolTip>
            </div>
          </>
        )}
        {channel.name === "general" && role !== MemberRole.GUEST && (
          <Lock className="ml-auto size-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
    </>
  );
};

export default ServerChannel;
