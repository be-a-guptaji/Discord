// hooks/useChatSocket.ts

import { useSocket } from "@/components/providers/socketProvider";
import { Member, Message, Profile } from "@/lib/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

type PaginatedMessages = {
  pages: {
    items: MessageWithMemberWithProfile[];
  }[];
  pageParams: unknown[];
};

export default function useChatSocket({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // Handle adding a new message
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<PaginatedMessages | undefined>(
        [queryKey],
        (oldData) => {
          if (
            !oldData ||
            !Array.isArray(oldData.pages) ||
            oldData.pages.length === 0
          ) {
            return {
              pages: [
                {
                  items: [message],
                },
              ],
              pageParams: [],
            };
          }

          const newPages = [...oldData.pages];
          const firstPage = oldData.pages[0];

          newPages[0] = {
            ...firstPage,
            items: [message, ...(firstPage?.items ?? [])], // Ensure items is iterable
          };

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
    });

    // Handle updating an existing message
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<PaginatedMessages | undefined>(
        [queryKey],
        (oldData) => {
          if (
            !oldData ||
            !Array.isArray(oldData.pages) ||
            oldData.pages.length === 0
          ) {
            return oldData;
          }

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            items: (page.items ?? []).map((item) =>
              item.id === message.id ? message : item
            ),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    });

    // Cleanup on unmount
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, queryClient, addKey, updateKey, queryKey]);
}
