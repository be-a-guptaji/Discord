// components/chat/chatHeader.tsx

import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobileToggle";
import UserAvatar from "@/components/userAvatar";
import SocketIndicator from "@/components/socketIndicator";
import ChatVideoButton from "@/components/chat/chatVideoButton";

interface ChatHeaderProps {
  serverID: string;
  name: string;
  type: "channel" | "conversation";
  imageURL?: string;
}

const ChatHeader = ({ serverID, name, type, imageURL }: ChatHeaderProps) => {
  return (
    <>
      <div className="text-md flex h-12 items-center gap-x-2 border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
        <MobileToggle serverID={serverID} />
        <div className="flex items-center">
          {type === "channel" && (
            <Hash className="mr-2 size-5 text-zinc-500 dark:text-zinc-400" />
          )}
          {type === "conversation" && (
            <UserAvatar src={imageURL} className="mr-2 size-8" />
          )}
          <p className="text-lg font-semibold text-black dark:text-white">
            {name}
          </p>
        </div>
        <div className="ml-auto flex items-center">
          {type === "conversation" && (
            <>
              <ChatVideoButton />
            </>
          )}
          <SocketIndicator />
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
