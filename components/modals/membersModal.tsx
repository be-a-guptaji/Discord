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
import { Fragment } from "react";
import UserAvatar from "@/components/userAvatar";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";

const roleIconMap = {
  GUEST: <User className="ml-2 size-4 text-gray-500" />,
  MODERATOR: <ShieldCheck className="ml-2 size-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};

const MembersModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onOpen, onClose } = useModal();

  // Extract the server data from the modal store
  const { server } = data as { server: ServerWithMembersWithProfiles };

  // This is for opening the modal for inviting friends
  const isModalOpen = type === "members" && isOpen;

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="overflow-hidden bg-white text-black">
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
