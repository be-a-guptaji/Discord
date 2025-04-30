// components/chat/chatMessage.tsx

"use client";

import { Hash, User } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <>
      <div className="mb-4 flex flex-col items-center space-y-2 px-4">
        <div className="flex items-center gap-x-2">
          {type === "channel" ? (
            <>
              <div className="flex size-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
                <Hash className="size-12 text-white" />
              </div>
              <p className="text-xl font-bold md:text-3xl">{`Welcome to # ${name}`}</p>
            </>
          ) : (
            <>
              <div className="flex size-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
                <User className="size-12 text-white" />
              </div>
              <p className="text-xl font-bold md:text-3xl">{`Start a conversation with ${name}`}</p>
            </>
          )}
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {type === "channel"
            ? `This is the start of the # ${name} channel.`
            : `Send a private message to ${name} to start a conversation.`}
        </p>
      </div>
    </>
  );
};

export default ChatWelcome;
