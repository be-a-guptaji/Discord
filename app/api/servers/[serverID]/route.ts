// app/api/servers/[serverID]/route.ts

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

    // Parse the request body to get the server name and image URL
    const { name, imageURL } = await req.json();

    // Update the server's data in the database
    const server = await db.server.update({
      where: {
        id: serverID,
        profileID: profile.id,
      },
      data: {
        name,
        imageURL,
      },
    });

    // Return the updated server data
    return NextResponse.json(server);
  } catch (error) {
    // Handle errors and log them
    console.error("Error while updating the server:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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

    // Delete the server's data in the database
    const server = await db.server.delete({
      where: {
        id: serverID,
        profileID: profile.id,
      },
    });

    // Return the updated server data
    return NextResponse.json(server);
  } catch (error) {
    // Handle errors and log them
    console.error("Error while deleting the server:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
