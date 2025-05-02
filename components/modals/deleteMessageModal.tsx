// components/modals/deleteMessageModal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChannelType } from "@/lib/generated/prisma/client";
import { Hash, Mic, Video } from "lucide-react";
import qs from "query-string";

// Mapping of channel types to icons
const iconMap = {
  [ChannelType.TEXT]: (
    <Hash className="size-4 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Mic className="size-4 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="size-4 text-zinc-500 dark:text-zinc-400" />
  ),
};

const DeleteMessageModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onClose } = useModal();

  // State to handle the loading state
  const [loading, setLoading] = useState(false);

  // Extract the apiURL and query from the modal store
  const { apiURL, query } = data;

  // This is for opening the modal for inviting friends
  const isModalOpen = type === "deleteMessage" && isOpen;

  // Function to delete the channel
  const onConfirm = async () => {
    try {
      // Set the loading state to true
      setLoading(true);

      // Define the query parameters
      const URL = qs.stringifyUrl({
        url: apiURL as string,
        query: query,
      });

      // Make a DELETE request to delete the channel
      await axios.delete(URL);

      // Close the modal
      onClose();
    } catch (error) {
      // Handle error
      console.error("Error deleting channel:", error);
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Modal to display the delete message confirmation"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Delete Message
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to do that? <br />
              The message will be deleted for everyone permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <Button
                disabled={loading}
                onClick={onClose}
                variant={"ghost"}
                className="w-[48%] bg-gray-400/50 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                onClick={onConfirm}
                variant={"primary"}
                className="w-[48%] bg-rose-500 hover:bg-rose-600"
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteMessageModal;
