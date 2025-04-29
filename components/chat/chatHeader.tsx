// components/chat/chatHeader.tsx

import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobileToggle";
import UserAvatar from "@/components/userAvatar";

interface ChatHeaderProps {
  serverID: string;
  name: string;
  type: "channel" | "conversation";
  imageURL?: string;
}

const ChatHeader = ({ serverID, name, type, imageURL }: ChatHeaderProps) => {
  return (
    <>
      <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
        <MobileToggle serverID={serverID} />
        {type === "channel" ? (
          <Hash className="mx-2 size-5 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <UserAvatar src={imageURL} className="mx-2 size-8" />
        )}
        <p className="text-lg font-semibold text-black dark:text-white">
          {name}
        </p>
      </div>
    </>
  );
};

export default ChatHeader;
