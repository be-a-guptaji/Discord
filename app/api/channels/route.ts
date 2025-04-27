// app/api/channels/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the current profile of the user
    const profile = await getCurrentProfile();

    // Check if the user is authenticated
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request URL to get the search parameters
    const { searchParams } = new URL(req.url);

    // Get the server ID from the search parameters
    const serverID = searchParams.get("serverID");

    // Check if the server ID is provided
    if (!serverID) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

    // Destructure the request body to get name and type
    const { name, type } = await req.json();

    // Return a 400 error if name is general
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    // Check if the channel already exists
    const existingChannel = await db.channel.findFirst({
      where: {
        name,
        serverID,
        type,
      },
    });

    // If the channel already exists, return the existing channel
    if (existingChannel) {
      return NextResponse.json(existingChannel);
    }

    // Create a new channel in the database
    const server = await db.server.update({
      where: {
        id: serverID,
        members: {
          some: {
            profileID: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileID: profile.id,
            name,
            type,
          },
        },
      },
    });

    // Return the created channel
    return NextResponse.json(server);
  } catch (error) {
    // Handle errors and log them
    console.error("Error creating channel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
