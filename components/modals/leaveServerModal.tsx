// components/modals/leaveServerModal.tsx

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
import { useRouter } from "next/navigation";

const LeaveServerModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onClose } = useModal();

  // Navigation hook
  const router = useRouter();

  // State to handle the loading state
  const [loading, setLoading] = useState(false);

  // Extract the server data from the modal store
  const { server } = data;

  // This is for opening the modal for inviting friends
  const isModalOpen = type === "leaveServer" && isOpen;

  // Function to leave the server
  const onConfirm = async () => {
    try {
      // Set the loading state to true
      setLoading(true);

      // Make an API call to leave the server
      await axios.patch(`/api/servers/${server?.id}/leave`);

      // Close the modal
      onClose();

      // Refresh the router to update the UI
      router.refresh();

      // Navigate to the home page
      router.push("/");
    } catch (error) {
      // Handle error
      console.error("Error leaving server:", error);
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
          aria-describedby="Modal to display the leave server confirmation"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Leave Server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to leave{" "}
              <span className="font-semibold text-indigo-500">
                {server?.name}
              </span>
              ?
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
                Cancle
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

export default LeaveServerModal;
