// app/api/channels/[channelID]/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ channelID: string }> }
) {
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

    // Get the channel ID from the request parameters
    const { channelID } = await params;

    // Check if the channel ID is provided
    if (!channelID) {
      return new NextResponse("Channel ID is missing", { status: 400 });
    }

    // Delete the channel in the database
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
          delete: {
            id: channelID,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    // Return the updated channel data
    return NextResponse.json(server);
  } catch (error) {
    // Handle error and log them
    console.error("Error deleting channel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
