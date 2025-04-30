// components/chat/chatInput.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Hash, Mic, Plus, Smile, Video } from "lucide-react";
import { ChannelType } from "@/lib/generated/prisma/client";
import axios from "axios";
import qs from "query-string";

interface ChatInputProps {
  apiURL: string;
  query: Record<string, string>;
  name: string;
  type: "channel" | "conversation";
  channelType?: ChannelType;
}

const formSchema = z.object({
  content: z.string().min(1),
});

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

const ChatInput = ({
  apiURL,
  query,
  name,
  type,
  channelType,
}: ChatInputProps) => {
  // Construct a form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // Get the loading state from the form
  const isLoading = form.formState.isSubmitting;

  // Function to submit the form
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Build the API URL for creating a channel, including optional serverID as a query parameter
      const URL = qs.stringifyUrl({
        url: apiURL,
        query,
      });

      // Make a POST request to create a channel
      await axios.post(URL, data);
    } catch (error) {
      // Handle error and log them
      console.error(error);
    }

    // Reset the form after submission
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        {" "}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      onClick={() => {}}
                      type="button"
                      className="absolute top-7 left-8 flex size-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      disabled={isLoading}
                      placeholder={`Message ${type === "conversation" ? "@" + " " + name : "#" + " " + name}`}
                      className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                      {...field}
                    />
                    <div className="absolute top-7 right-8">
                      <Smile />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default ChatInput;
