// componets/mobileToggle.tsx

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSidebar from "@/components/navigation/navigationSidebar";
import ServerSidebar from "@/components/server/serverSidebar";

const MobileToggle = ({ serverID }: { serverID: string }) => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"} className="md:hidden">
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-row gap-0 p-0">
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
          <ServerSidebar serverID={serverID} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileToggle;
