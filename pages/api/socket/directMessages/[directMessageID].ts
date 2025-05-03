// pages/api/socket/directMessages/[directMessageID].ts

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

    // Destructure the request body to get the directMessageID and conversationID
    const { directMessageID, conversationID } = req.query;

    // Check if the conversationID is provided
    if (!conversationID) {
      return res.status(400).json({ error: "Missing conversationID" });
    }

    // Check if the directMessageID is provided
    if (!directMessageID) {
      return res.status(400).json({ error: "Missing directMessageId" });
    }

    // Check if the content is provided
    if (!content && !fileURL && req.method !== "DELETE") {
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
    // Find the directMessages by ID
    let directMessages = await db.directMessage.findFirst({
      where: {
        id: directMessageID as string,
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

    // Check if the directMessage is found
    if (!directMessages || directMessages.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the user is the owner of the message
    const isMessageOwner = directMessages.memberID === member.id;

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
      directMessages = await db.directMessage.update({
        where: {
          id: directMessageID as string,
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
      directMessages = await db.directMessage.update({
        where: {
          id: directMessageID as string,
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
    const updateKey = `chat:${conversation.id}:messages:update`;

    // Emit the update event
    res?.socket?.server?.io?.emit(updateKey, directMessages);

    // Return the directMessages
    return res.status(200).json(directMessages);
  } catch (error) {
    // Handle error and log them
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
