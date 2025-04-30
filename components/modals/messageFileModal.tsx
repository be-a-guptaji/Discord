// components/modals/messageFileModal.tsx

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/fileUpload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";

// This is the schema for the form
const formSchema = z.object({
  fileURL: z.string().url({
    message: "Attachment is required",
  }),
});

const MessageFileModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onClose } = useModal();

  // Navigation hook
  const router = useRouter();

  // Destructure the apiURL and query data from the modal store
  const { apiURL, query } = data;

  // This is for opening the modal for inviting friends
  const isModalOpen = type === "messageFile" && isOpen;

  // This is the form value and validation from react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileURL: "",
    },
  });

  // This is the loading state for the form
  const isLoading = form.formState.isSubmitting;

  // Function to close the modal
  const handleClose = () => {
    form.reset();
    onClose();
  };

  // This is the submit function for the form
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Build the API URL for creating a channel, including optional serverID as a query parameter
      const URL = qs.stringifyUrl({
        url: apiURL || "",
        query,
      });

      // Make a POST request to create a server
      await axios.post(URL, { ...data, content: data.fileURL });

      // Reset the form after submission
      form.reset();

      // Refresh the page after submission
      router.refresh();

      // Close the modal after submission
      handleClose();
    } catch (error) {
      // Handle error
      console.error("Error creating server:", error);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Initial Modal for new users"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Add an attachment
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Send an image, video, audio, or file as a message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="fileURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button
                  disabled={isLoading}
                  variant={"primary"}
                  className="w-full"
                >
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageFileModal;
