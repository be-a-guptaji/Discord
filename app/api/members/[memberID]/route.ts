// app/api/members/[memberID]/route.ts

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberID: string }> }
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

    // Get the server ID from the request parameters
    const { memberID } = await params;

    // Check if the server ID is provided
    if (!memberID) {
      return new NextResponse("Member ID is missing", { status: 400 });
    }

    // Extract the role from the request body
    const { role } = await req.json();

    // Update the member's role in the database
    const server = await db.server.update({
      where: {
        id: serverID,
        profileID: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberID,
              profileID: {
                not: profile.id, // Ensure the member is not the Admin of the serve
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    // Return the updated server data
    return NextResponse.json(server);
  } catch (error) {
    // Handle errors and log them
    console.error("Error in PATCH:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberID: string }> }
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

    // Get the server ID from the request parameters
    const { memberID } = await params;

    // Check if the server ID is provided
    if (!memberID) {
      return new NextResponse("Member ID is missing", { status: 400 });
    }

    // Kick the member from the server
    const server = await db.server.update({
      where: {
        id: serverID,
        profileID: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberID,
            profileID: {
              not: profile.id, // Ensure the member is not the Admin of the serve
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    // Return the updated server data
    return NextResponse.json(server);
  } catch (error) {
    // Handle errors and log them
    console.error("Error in DELETE:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
