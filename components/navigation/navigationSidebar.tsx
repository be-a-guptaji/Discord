// component/navigation/navigationSidebar.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "@/components/navigation/navigationAction";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment } from "react";
import NavigationItem from "@/components/navigation/navigationItem";
import { ModeToggle } from "@/components/modeToggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileID: profile.id,
        },
      },
    },
  });

  return (
    <>
      <div className="text-primary flex size-full flex-col items-center space-y-4 py-3 dark:bg-[#1E1F22]">
        <NavigationAction />
        <Separator className="mx-auto h-[2px] !w-14 rounded-md bg-zinc-300 dark:bg-zinc-700" />
        <ScrollArea className="w-full flex-1">
          {servers.map((server) => (
            <Fragment key={server.id}>
              <div className="mb-4">
                <NavigationItem
                  id={server.id}
                  name={server.name}
                  imageURL={server.imageURL}
                />
              </div>
            </Fragment>
          ))}
        </ScrollArea>
        <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
          <ModeToggle />
          <UserButton appearance={{ elements: { avatarBox: "size-[48px]" } }} />
        </div>
      </div>
    </>
  );
};

export default NavigationSidebar;