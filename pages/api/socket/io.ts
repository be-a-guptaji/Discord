// pages/api/socket/io.ts

import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket?.server?.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer | undefined = res.socket?.server as any;
    if (httpServer) {
      const io = new ServerIO(httpServer, {
        path,
        addTrailingSlash: false,
        cors: {
          origin: process.env.NEXT_PUBLIC_SITE_URL,
          methods: ["GET", "POST"],
          credentials: true,
        },
      });
      (res.socket as any).server.io = io;
    }
  }

  res.end();
};

export default ioHandler;
