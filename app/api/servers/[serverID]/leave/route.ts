// app/api/servers/[serverID]/leave/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverID: string }> }
) {
  try {
    // Get the current profile of the user
    const profile = await getCurrentProfile();

    // Check if the user is authenticated
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the server ID from the request parameters
    const { serverID } = await params;

    // Check if the server ID is provided
    if (!serverID) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

    // Leave the server in the database
    const server = await db.server.update({
      where: {
        id: serverID,
        profileID: {
          not: profile.id, // Ensure that the admin is not leaving the server
        },
        members: {
          some: {
            profileID: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileID: profile.id,
          },
        },
      },
    });

    // Return the updated server
    return NextResponse.json(server);
  } catch (error) {
    // Handle errors and log them
    console.error("Error leaving server:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
