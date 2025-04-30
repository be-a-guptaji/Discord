// components/socketIndicator.tsx

"use client";

import { useSocket } from "@/components/providers/socketProvider";
import { Badge } from "@/components/ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <>
        <Badge
          variant="outline"
          className="border-none bg-yellow-600 text-white"
        >
          Connecting
        </Badge>
      </>
    );
  }

  return (
    <>
      <Badge
        variant="outline"
        className="border-none bg-emerald-600 text-white"
      >
        Live
      </Badge>
    </>
  );
};

export default SocketIndicator;
