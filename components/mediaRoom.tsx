// components/mediaRoom.tsx

"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
  RoomAudioRenderer,
  useTracks,
  LayoutContextProvider,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import "@livekit/components-styles";

interface MediaRoomProps {
  chatID: string;
  audio: boolean;
  video: boolean;
}

function VideoLayout({ audio, video }: { audio: boolean; video: boolean }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <LayoutContextProvider>
      <div className="flex h-full w-full flex-col">
        <RoomAudioRenderer />

        <GridLayout tracks={tracks} className="flex-1">
          <ParticipantTile />
        </GridLayout>

        <ControlBar
          controls={{
            microphone: audio,
            camera: video,
            screenShare: video,
            chat: audio,
            leave: false, // this hides the Leave button
          }}
        />
      </div>
    </LayoutContextProvider>
  );
}

const MediaRoom = ({ chatID, audio, video }: MediaRoomProps) => {
  // Get the current user
  const { user } = useUser();

  // State to handle the token
  const [token, setToken] = useState("");

  // useEffect hook to handle the token
  useEffect(() => {
    // If the user doesn't have a first name, return
    if (!user?.firstName) return;

    // Get the user's full name
    const name = `${user.firstName} ${user.lastName ? user.lastName : ""}`;

    // Make an API call to get the token in an IIFE
    (async () => {
      try {
        // Make an API call to get the token
        const response = await fetch(
          `/api/token?room=${chatID}&username=${name}`
        );

        // Get the token from the response
        const data = await response.json();

        // Set the token
        setToken(data.token);
      } catch (error) {
        // Handle error and log them
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatID]);

  // If the token is empty, return a loader
  if (!token) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="size-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        token={token}
        video={video}
        audio={audio}
      >
        <VideoLayout audio={audio} video={video} />
      </LiveKitRoom>
    </>
  );
};

export default MediaRoom;
