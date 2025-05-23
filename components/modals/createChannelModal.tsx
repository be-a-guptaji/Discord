// components/modals/createChannelModal.tsx

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { ChannelType } from "@/lib/generated/prisma/client";
import qs from "query-string";
import { useEffect } from "react";

// This is the schema for the form
const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required",
    })
    .refine((name) => name !== "general", {
      message: "Channel name 'general' already exsits in the server",
    }),
  type: z.nativeEnum(ChannelType, {
    message: "Channel type is required",
  }),
});

const CreateChannelModal = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type, data, isOpen, onClose } = useModal();

  // Navigation hook
  const router = useRouter();

  // Params hook
  const params = useParams();

  // This is for opening the modal for creating a server
  const isModalOpen = type === "createChannel" && isOpen;

  // Extract the channel type from the data object
  const { channelType } = data;

  // This is the form value and validation from react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  // UseEffect hook to change the type of the channel
  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType);
    } else {
      form.setValue("type", ChannelType.TEXT);
    }
  });

  // This is the loading state for the form
  const isLoading = form.formState.isSubmitting;

  // This is the submit function for the form
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Build the API URL for creating a channel, including optional serverID as a query parameter
      const URL = qs.stringifyUrl({
        url: "/api/channels",
        query: { serverID: params?.serverID },
      });

      // Make a POST request to create a channel
      await axios.post(URL, data);

      // Reset the form after submission
      form.reset();

      // Refresh the page after submission
      router.refresh();

      // Close the modal after submission
      onClose();
    } catch (error) {
      // Handle error
      console.error("Error creating server:", error);
    }
  };

  // This is the close function for the modal
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Create channel for your server"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Create Channel
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter channel name"
                          {...field}
                          disabled={isLoading}
                          className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-300/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                        Channel Type
                      </FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full border-0 !bg-zinc-300/50 text-black capitalize ring-offset-0 outline-none focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Select a channel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type === ChannelType.AUDIO
                                ? "Voice"
                                : type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button
                  disabled={isLoading}
                  variant={"primary"}
                  className="w-full"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannelModal;
