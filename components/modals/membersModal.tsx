// components/modals/membersModal.tsx

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
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import axios from "axios";

const MembersModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onOpen, onClose } = useModalStore();
  const origin = useOrigin();

  // State to handle the copying of invite link and also the loading state
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract the server data from the modal store
  const { server } = data;

  // This is for the invite link
  const inviteURL = `${origin}/invite/${server?.inviteCode}`;

  // This is for opening the modal for inviting friends
  const isModalOpen = type === "invite" && isOpen;

  // Function to copy the invite link to the clipboard
  const onCopy = () => {
    // Copy the invite link to the clipboard
    navigator.clipboard.writeText(inviteURL);

    // Set the copied state to true
    setCopied(true);

    // Stop using the copied state for 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Function to generate a new invite link
  const onGenerateNewLink = async () => {
    try {
      // Set the loading state to true
      setLoading(true);

      // Make an API call to generate a new invite link
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      // Open the modal with the new invite link
      onOpen("invite", {
        server: {
          ...response.data,
        },
      });
    } catch (error) {
      // Handle error
      console.error("Error generating new invite link:", error);
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  };

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
                value={inviteURL}
                disabled={loading}
                className="border-0 bg-zinc-300/50 text-black selection:bg-transparent selection:text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-300/50"
              />
              <Button
                size={"icon"}
                onClick={onCopy}
                disabled={loading}
                className="bg-zinc-300/50 hover:bg-zinc-300/50 dark:bg-zinc-300/50"
              >
                {copied ? (
                  <>
                    <Check className="size-4 text-black" />
                  </>
                ) : (
                  <>
                    <Copy className="size-4 text-black" />
                  </>
                )}
              </Button>
            </div>
            <Button
              variant={"primary"}
              size={"sm"}
              onClick={onGenerateNewLink}
              disabled={loading}
              className="mt-4 w-full cursor-pointer text-xs tracking-wider text-zinc-800"
            >
              Generate a new link
              <RefreshCw className="ml-2 size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MembersModal;
