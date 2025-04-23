// component/navigation/navigationSidebar.tsx

import getCurrentProfile from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "@/components/navigation/navigationAction";

const NavigationSidebar = async () => {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const server = await db.server.findMany({
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
      <div className="text-primary flex h-full w-full flex-col items-center space-y-4 py-3 dark:bg-[#1E1F22]">
        <NavigationAction />
      </div>
    </>
  );
};

export default NavigationSidebar;
