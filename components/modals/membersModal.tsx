// components/modals/membersModal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModal";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment, useState } from "react";
import UserAvatar from "@/components/userAvatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/lib/generated/prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

// Mapping of member roles to icons
const roleIconMap = {
  GUEST: <User className="ml-2 size-4 text-gray-500" />,
  MODERATOR: <ShieldCheck className="ml-2 size-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};

const MembersModal = () => {
  // This is the router for navigating to different pages
  const router = useRouter();

  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onOpen, onClose } = useModal();

  // Loading state for the Specific Members
  const [loadingID, setLoadingID] = useState("");

  // Extract the server data from the modal store
  const { server } = data as { server: ServerWithMembersWithProfiles };

  // This is for opening the modal for inviting friends
  const isModalOpen = type === "members" && isOpen;

  // Function to change the role of the member in the server
  const changeRole = async (memberID: string, role: MemberRole) => {
    try {
      // Set the loading state to the member ID
      setLoadingID(memberID);

      // Build the API URL for fetching a member's data, including optional serverID as a query parameter
      const URL = qs.stringifyUrl({
        url: `/api/members/${memberID}`,
        query: { serverID: server?.id },
      });

      // Make a PATCH request to the API to change the member's role
      const response = await axios.patch(URL, {
        role,
      });

      // Refresh the router to update the UI
      router.refresh();

      // Open the modal to show the updated member list
      onOpen("members", {
        server: response.data,
      });
    } catch (error) {
      // Handle error
      console.error("Error changing role:", error);
    } finally {
      // Reset the loading state
      setLoadingID("");
    }
  };

  // Function to kick a member from the server
  const kickMember = async (memberID: string) => {
    try {
      // Set the loading state to the member ID
      setLoadingID(memberID);

      // Build the API URL for fetching a member's data, including optional serverID as a query parameter
      const URL = qs.stringifyUrl({
        url: `/api/members/${memberID}`,
        query: { serverID: server?.id },
      });

      // Make a DELETE request to the API to kick the member from the server
      const response = await axios.delete(URL);

      // Refresh the router to update the UI
      router.refresh();

      // Open the modal to show the updated member list
      onOpen("members", {
        server: response.data,
      });
    } catch (error) {
      // Handle error
      console.error("Error kicking member:", error);
    } finally {
      // Reset the loading state
      setLoadingID("");
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent
          className="overflow-hidden bg-white text-black"
          aria-describedby="Manage Members"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              {server?.members?.length} Members
            </DialogDescription>{" "}
          </DialogHeader>
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <Fragment key={member.id}>
                <div className="mb-6 flex items-center gap-x-2">
                  <UserAvatar src={member.profile?.imageURL} />
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-1 text-xs font-semibold">
                      {member.profile?.name}
                      {roleIconMap[member.role]}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {member.profile?.email}
                    </p>
                  </div>
                  {loadingID === member.id && (
                    <>
                      <Loader2 className="ml-auto size-4 animate-spin text-zinc-500" />
                    </>
                  )}
                  {server.profileID !== member.profileID &&
                    loadingID !== member.id && (
                      <>
                        <div className="ml-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                              <MoreVertical className="size-4 text-zinc-500" />
                              <DropdownMenuContent side="left">
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="flex items-center">
                                    <ShieldQuestion className="mr-2 size-4" />
                                    <span>Role</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          changeRole(member.id, "GUEST")
                                        }
                                      >
                                        <User className="mr-2 size-4" />
                                        Guest
                                        {member.role === "GUEST" && (
                                          <Check className="ml-auto size-4" />
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          changeRole(member.id, "MODERATOR")
                                        }
                                      >
                                        <ShieldCheck className="mr-2 size-4" />
                                        Moderator
                                        {member.role === "MODERATOR" && (
                                          <Check className="ml-auto size-4" />
                                        )}
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => kickMember(member.id)}
                                >
                                  <span className="flex items-center gap-x-2 font-semibold text-rose-500">
                                    <Gavel className="mr-2 size-4 text-rose-500" />
                                    Kick
                                  </span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenuTrigger>
                          </DropdownMenu>
                        </div>
                      </>
                    )}
                </div>
              </Fragment>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MembersModal;
