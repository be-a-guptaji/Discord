// pages/api/socket/directMessages.ts

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

    // Destructure the request body to get the conversationID
    const { content, fileURL, fileType } = req.body;

    // Destructure the request body to get the serverID and channelID
    const { conversationID } = req.query;

    // Check if the conversationID is provided
    if (!conversationID) {
      return res.status(400).json({ error: "Missing conversationID" });
    }

    // Check if the content is provided
    if (!content && !fileURL) {
      return res.status(400).json({ error: "Missing content" });
    }

    // Fetch the conversation from the database
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationID as string,
        OR: [
          {
            memberOne: {
              profileID: profile.id,
            },
          },
          {
            memberTwo: {
              profileID: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Check if the conversation is found
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Find if the user is a member of the conversation
    const member =
      conversation.memberOne.profileID === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    // Check if the user is a member of the server
    if (!member) {
      return res.status(401).json({ error: "Member not found" });
    }

    // Create a new direct message in the database
    const message = await db.directMessage.create({
      data: {
        fileURL: fileURL,
        fileType,
        content,
        memberID: member.id,
        conversationID: conversationID as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Create a key for the conversation to emit the message event
    const channelKey = `chat:${conversationID}:messages`;

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
