// components/modals/inviteModal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/useModalStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const InviteModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, isOpen, onClose } = useModalStore();

  const isModalOpen = type === "invite" && isOpen;

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="overflow-hidden bg-white p-0 text-black">
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label className="dark:text-secondary/70 text-sm font-bold text-zinc-500 uppercase">
              Server Invite Link
            </Label>
            <div className="mt-2 flex items-center gap-x-2">
              <Input
                readOnly
                value="invite link here"
                className="border-0 bg-zinc-300/50 text-black selection:bg-transparent selection:text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-300/50"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
