// app/api/directMessages/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { DirectMessage } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server";

// Define the Message Batch
const MESSAGE_BATCH = 20;

export async function GET(req: Request) {
  try {
    // Get the current profile of the user
    const profile = await getCurrentProfile();

    // Check if the user is authenticated
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request URL to get the search parameters
    const { searchParams } = new URL(req.url);

    // Get the cursor from the search parameters
    const cursor = searchParams.get("cursor");

    // Get the conversation ID from the search parameters
    const conversationID = searchParams.get("conversationID");

    // Check if the conversation ID is provided
    if (!conversationID) {
      return new NextResponse("Conversation ID is missing", { status: 400 });
    }

    // Empty array to store messages
    let messages: DirectMessage[] = [];

    // Fetch messages from the database if cursor is provided
    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationID,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationID,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Define the next cursor state
    let nextCursor = null;

    // Get the next cursor
    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    // Return the messages as a JSON response
    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    // Handle error and log them
    console.error("Error fetching message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
