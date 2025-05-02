// pages/api/socket/messages.ts

import getCurrentProfilePages from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch the current profile of the user
    const profile = await getCurrentProfilePages(req);

    // Check if the user is authenticated
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Destructure the request body to get the content, fileURL and fileType
    const { content, fileURL, fileType } = req.body;

    // Destructure the request body to get the serverID and channelID
    const { serverID, channelID } = req.query;

    // Check if the serverID is provided
    if (!serverID) {
      return res.status(400).json({ error: "Missing serverId" });
    }

    // Check if the channelID is provided
    if (!channelID) {
      return res.status(400).json({ error: "Missing channelId" });
    }

    // Check if the content is provided
    if (!content && !fileURL) {
      return res.status(400).json({ error: "Missing content" });
    }

    // Fetch server using serverID
    const server = await db.server.findFirst({
      where: {
        id: serverID as string,
        members: {
          some: {
            profileID: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    // Check if the server is found
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Find the channel using channelID
    const channel = await db.channel.findFirst({
      where: {
        id: channelID as string,
        serverID: serverID as string,
      },
    });

    // Check if the channel is found
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Find if the user is a member of the server
    const member = server.members.find(
      (member) => member.profileID === profile.id
    );

    // Check if the user is a member of the server
    if (!member) {
      return res.status(401).json({ error: "Member not found" });
    }

    // Create a new message in the database
    const message = await db.message.create({
      data: {
        content: !!content ? (content as string) : "",
        fileURL,
        fileType: fileType as string,
        channelID: channelID as string,
        memberID: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Create a key for the channel to emit the message event
    const channelKey = `chat:${channelID}:messages`;

    // Emit a new message event to all connected clients
    res?.socket?.server?.io?.emit(channelKey, message);

    // Send the message as a response
    return res.status(200).json(message);
  } catch (error) {
    // Handle error and log them
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
