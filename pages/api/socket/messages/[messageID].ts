// pages/api/socket/messages/[messageID].ts

import getCurrentProfilePages from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma/client";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch the current profile of the user
    const profile = await getCurrentProfilePages(req);

    // Check if the user is authenticated
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Destructure the request body to get the content and fileURL
    const { content, fileURL } = req.body;

    // Destructure the request body to get the serverID, channelID and messageID
    const { serverID, channelID, messageID } = req.query;

    // Check if the serverID is provided
    if (!serverID) {
      return res.status(400).json({ error: "Missing serverId" });
    }

    // Check if the channelID is provided
    if (!channelID) {
      return res.status(400).json({ error: "Missing channelId" });
    }

    // Check if the messageID is provided
    if (!messageID) {
      return res.status(400).json({ error: "Missing messageId" });
    }

    // Check if the content is provided
    if (!content && !fileURL && req.method !== "DELETE") {
      return res.status(400).json({ error: "Missing content" });
    }

    // Find server by ID
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

    // Find channel by ID
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
      return res.status(404).json({ error: "Member not found" });
    }

    // Find the message by ID
    let message = await db.message.findFirst({
      where: {
        id: messageID as string,
        channelID: channelID as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Check if the message is found
    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the user is the owner of the message
    const isMessageOwner = message.memberID === member.id;

    // Check if the user is an admin of the server
    const isAdmin = member.role === MemberRole.ADMIN;

    // Check if the user is a moderator of the server
    const isModerator = member.role === MemberRole.MODERATOR;

    // Check if the user can modify the message
    const canModify = isMessageOwner || isAdmin || isModerator;

    // Throw an error if the user cannot modify the message
    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the request method is DELETE
    if (req.method === "DELETE") {
      // Delete the message
      message = await db.message.update({
        where: {
          id: messageID as string,
        },
        data: {
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    // Check if the request method is PATCH
    if (req.method === "PATCH") {
      // Check if the user is the owner of the message
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Update the message
      message = await db.message.update({
        where: {
          id: messageID as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    // Create a key for the update event
    const updateKey = `chat:${channelID}:messages:update`;

    // Emit the update event
    res?.socket?.server?.io?.emit(updateKey, message);

    // Return the message
    return res.status(200).json(message);
  } catch (error) {
    // Handle error and log them
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
