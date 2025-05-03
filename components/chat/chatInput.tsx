// components/chat/chatInput.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Send } from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/useModal";
import EmojiPicker from "@/components/emojiPicker";
import ActionToolTip from "@/components/actionToolTip";

interface ChatInputProps {
  name: string;
  apiURL: string;
  query: Record<string, string>;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ name, apiURL, query, type }: ChatInputProps) => {
  // Construct a form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // This is the modal store for opening and closing the modal and getting the type of modal
  const { onOpen } = useModal();

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
                    <ActionToolTip label="Add File" side="top" align="center">
                      <button
                        onClick={() => onOpen("messageFile", { apiURL, query })}
                        type="button"
                        className="absolute top-7 left-8 flex size-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                      >
                        <Plus className="text-white dark:text-[#313338]" />
                      </button>
                    </ActionToolTip>
                    <Input
                      disabled={isLoading}
                      placeholder={`Message ${type === "conversation" ? "@" + " " + name : "#" + " " + name}`}
                      className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                      {...field}
                    />
                    <ActionToolTip label="Emoji" side="top" align="center">
                      <div className="absolute top-7 right-16">
                        <EmojiPicker
                          onChange={(emoji: string) =>
                            field.onChange(`${field.value} ${emoji}`)
                          }
                        />
                      </div>
                    </ActionToolTip>
                    <ActionToolTip label="Send" side="top" align="center">
                      <div className="absolute top-7 right-8">
                        <button
                          onClick={form.handleSubmit(onSubmit)}
                          className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                        >
                          <Send className="size-6" />
                        </button>
                      </div>
                    </ActionToolTip>
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
