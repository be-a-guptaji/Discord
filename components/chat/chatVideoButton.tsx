// components/chat/chatVideoButton.tsx

"use client";

import qs from "query-string";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Video, VideoOff } from "lucide-react";
import ActionToolTip from "@/components/actionToolTip";

const ChatVideoButton = () => {
  // Get the pathname
  const pathname = usePathname();

  // Get the router
  const router = useRouter();

  // Get the search params
  const searchParams = useSearchParams();

  // Get the video status
  const isVideo = searchParams?.get("video");

  // Assign the icon based on the video status
  const Icon = isVideo ? VideoOff : Video;

  // Assign the label based on the video status
  const toolTipLabel = isVideo ? "End video call" : "Start video call";

  // Function to handle the button click
  const onClick = () => {
    // Build the API URL for creating a channel, including optional serverID as a query parameter
    const URL = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      {
        skipNull: true,
      }
    );

    router.push(URL);
  };

  return (
    <>
      <ActionToolTip label={toolTipLabel} side="bottom" align="center">
        <button onClick={onClick} className="mr-4 transition hover:opacity-75">
          <Icon className="size-6 text-zinc-500 dark:text-zinc-400" />
        </button>
      </ActionToolTip>
    </>
  );
};

export default ChatVideoButton;
