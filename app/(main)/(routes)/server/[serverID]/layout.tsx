// app/(main)/(routes)/server/[serverID]/layout.tsx

import ServerSidebar from "@/components/server/serverSidebar";
import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ServerIDLayout = async ({
  params,
  children,
}: {
  params: Promise<{ serverID: string }>;
  children: ReactNode;
}) => {
  // Await the params to get the serverID
  const { serverID } = await params;

  // Get the current profile of the user
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverID,
      members: {
        some: {
          profileID: profile.id,
        },
      },
    },
  });

  if (!server) {
    redirect("/");
  }

  return (
    <>
      <div className="h-full">
        <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
          <ServerSidebar serverID={serverID} />
        </div>
        <main className="h-full md:pl-60">{children}</main>
      </div>
    </>
  );
};

export default ServerIDLayout;
