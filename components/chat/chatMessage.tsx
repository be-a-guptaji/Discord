// components/chat/chatMessage.tsx

"use client";

import { Member, Message, Profile } from "@/lib/generated/prisma/client";
import ChatWelcome from "@/components/chat/chatWelcome";
import { format } from "date-fns";
import { useChatQuery } from "@/hooks/useChatQuery";
import ChatItem from "@/components/chat/chatItem";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatID: string;
  apiURL: string;
  socketURL: string;
  socketQuery: Record<string, string>;
  paramValue: string;
  paramKey: "channelID" | "conversationID";
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

const ChatMessages = ({
  name,
  member,
  chatID,
  apiURL,
  socketURL,
  socketQuery,
  paramValue,
  paramKey,
  type,
}: ChatMessagesProps) => {
  // Get the messages using the useChatQuery hook
  const { data, hasNextPage, isFetchingNextPage, status, fetchNextPage } =
    useChatQuery({
      queryKey: `chat:${chatID}`,
      apiURL,
      paramValue,
      paramKey,
    });

  // If status is pending, return a loading message
  if (status === "pending") {
    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center">
          <Loader2 className="my-4 size-7 animate-spin text-zinc-500" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Loading messages...
          </p>
        </div>
      </>
    );
  }

  // If status is error, return a error message
  if (status === "error") {
    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center">
          <ServerCrash className="my-4 size-7 animate-pulse text-zinc-500" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Something went wrong!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <div className="flex-1" />
        <ChatWelcome name={name} type={type} />
        <div className="mt-auto flex flex-1 flex-col-reverse">
          {data?.pages?.map((group, index) => (
            <Fragment key={index}>
              {group?.items?.map((message: MessageWithMemberWithProfile) => (
                <Fragment key={message.id}>
                  <ChatItem
                    id={message.id}
                    content={message.content}
                    member={message.member}
                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    fileURL={message.fileURL}
                    fileType={message.fileType}
                    deleted={message.deleted}
                    currentMember={member}
                    isUpdated={message.updatedAt !== message.createdAt}
                    socketURL={socketURL}
                    socketQuery={socketQuery}
                  />
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatMessages;
