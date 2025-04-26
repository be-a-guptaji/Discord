// components/server/serverHeader.tsx

"use client";

import { MemberRole } from "@/lib/generated/prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/useModal";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  // Import the modal store to handle modal actions
  const { onOpen } = useModal();

  // Check the role of the user in the server
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
            {server.name}
            <ChevronDown className="ml-auto size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
          {isModerator && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen("invite", { server })}
                className="cursor-pointer px-3 py-2 text-sm !text-indigo-600 dark:!text-indigo-400"
              >
                Invite People
                <UserPlus className="ml-auto size-4 !text-indigo-600 dark:!text-indigo-400" />
              </DropdownMenuItem>
            </>
          )}
          {isModerator && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen("createChannel")}
                className="cursor-pointer px-3 py-2 text-sm !text-indigo-600 dark:!text-indigo-400"
              >
                Create Channel
                <PlusCircle className="ml-auto size-4 !text-indigo-600 dark:!text-indigo-400" />
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen("members", { server })}
                className="cursor-pointer px-3 py-2 text-sm"
              >
                Manage Members
                <Users className="ml-auto size-4" />
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen("editServer", { server })}
                className="cursor-pointer px-3 py-2 text-sm"
              >
                Server Settings
                <Settings className="ml-auto size-4" />
              </DropdownMenuItem>
            </>
          )}
          {isModerator && (
            <>
              <DropdownMenuSeparator />
            </>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm !text-rose-500 dark:!text-rose-400">
                Delete Server
                <Trash className="ml-auto size-4 !text-rose-500 dark:!text-rose-400" />
              </DropdownMenuItem>
            </>
          )}
          {!isAdmin && (
            <>
              <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm !text-rose-500 dark:!text-rose-400">
                Leave Server
                <LogOut className="ml-auto size-4 !text-rose-500 dark:!text-rose-400" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ServerHeader;
