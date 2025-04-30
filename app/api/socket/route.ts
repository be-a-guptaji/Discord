// app/api/socket/route.ts

import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/types";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export function GET(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket?.server?.io) {
    const path = "/api/socket";
    const httpServer: NetServer | undefined = res.socket?.server as any;

    if (httpServer) {
      const io = new ServerIO(httpServer, { path, addTrailingSlash: false });
      (res.socket as any).server.io = io;
    }
  }

  return NextResponse.json({ message: "Socket connected" });
}
