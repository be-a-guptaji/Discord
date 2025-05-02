// components/chat/chatItem.tsx

"use client";

import { Member, MemberRole, Profile } from "@/lib/generated/prisma/client";
import UserAvatar from "@/components/userAvatar";
import ActionToolTip from "@/components/actionToolTip";
import {
  Edit,
  FileIcon,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Trash,
  User,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileURL: string | null;
  fileType: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketURL: string;
  socketQuery: Record<string, string>;
}

// Mapping of member roles to icons
const roleIconMap = {
  [MemberRole.GUEST]: <User className="ml-2 size-4 text-gray-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};

// This is form schema for editing the message
const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileURL,
  fileType,
  deleted,
  currentMember,
  isUpdated,
  socketURL,
  socketQuery,
}: ChatItemProps) => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { onOpen } = useModal();

  // Navigation hook
  const router = useRouter();

  // Params hook
  const params = useParams();

  // State to handle the editing state of the message
  const [isEditing, setIsEditing] = useState(false);

  // Form hook to handle form submission
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  // Use effect to handle updating the message
  useEffect(() => {
    form.reset({
      content,
    });
  }, [content, form]);

  // Extract loading state from form
  const isLoading = form.formState.isSubmitting;

  // Check if the current member is an admin
  const isAdmin = currentMember.role === MemberRole.ADMIN;

  // Check if the current member is a moderator
  const isModerator = currentMember.role === MemberRole.MODERATOR;

  // Check if the current member is the author of the message
  const isOwner = currentMember.id === member.id;

  // Check if the current member is the author of the message or an admin or a moderator
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);

  // Check if the current member is the author of the message to edit
  const canEditMessage = !deleted && isOwner && content;

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Build the API URL for creating a channel, including optional serverID as a query parameter
      const URL = qs.stringifyUrl({
        url: `${socketURL}/${id}`,
        query: socketQuery,
      });

      // Make a PATCH request to edit a Message
      await axios.patch(URL, { ...data, fileURL });

      // Reset the form after submission
      form.reset();
    } catch (error) {
      // Handle error and log them
      console.log(error);
    } finally {
      // Set the editing state to false
      setIsEditing(false);
    }
  };

  // UseEffect hook to handle the opening and closing of the input field using the keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  // Function to redirect the user to member page on click to his name
  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/server/${params?.serverID}/conversation/${member.id}`);
  };

  return (
    <>
      <div className="group relative my-2 flex w-full items-center p-4 transition hover:bg-black/5">
        <div className="group flex w-full items-start gap-x-2">
          <button
            onClick={onMemberClick}
            className="cursor-pointer transition hover:drop-shadow-md"
          >
            <UserAvatar src={member.profile.imageURL} />
          </button>
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <button onClick={onMemberClick}>
                  <p className="mx-2 cursor-pointer text-sm font-semibold hover:underline">
                    {member.profile.name}
                  </p>
                </button>
                <ActionToolTip lable={member.role} side="right" align="center">
                  {roleIconMap[member.role]}
                </ActionToolTip>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {timestamp}
              </span>
            </div>

            {fileType === "pdf" && fileURL && (
              <>
                <div className="bg-background/10 relative mt-2 flex h-16 w-48 items-center rounded-md">
                  <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-full items-center justify-center gap-x-6 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
                  >
                    <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
                    <p className="truncate text-wrap">PDF File</p>
                  </a>
                </div>
              </>
            )}

            {fileType === "mp3" && fileURL && (
              <>
                <div className="bg-background/10 relative mt-2 flex w-fit items-center rounded-md p-2">
                  <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-sm text-indigo-500 hover:underline dark:text-indigo-400"
                  >
                    <Mic className="size-10 fill-indigo-200 stroke-indigo-400" />
                    <audio controls src={fileURL} />
                  </a>
                </div>
              </>
            )}

            {fileType === "mp4" && fileURL && (
              <>
                <div className="bg-background/10 relative mt-2 flex size-fit items-center rounded-md p-2">
                  <a
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-sm text-indigo-500 hover:underline dark:text-indigo-400"
                  >
                    <video
                      src={fileURL}
                      className="aspect-video w-[390px] rounded-md"
                      autoPlay={true}
                      muted
                      controls
                    />
                  </a>
                </div>
              </>
            )}

            {fileType &&
              !["pdf", "mp3", "mp4"].includes(fileType) &&
              fileURL && (
                <a
                  href={fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary relative mt-2 flex aspect-square size-48 items-center overflow-hidden rounded-md border"
                >
                  <Image
                    fill
                    priority
                    src={fileURL}
                    alt={fileType}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </a>
              )}

            {content && !isEditing && (
              <p
                className={cn(
                  "mt-2 ml-2 text-sm text-zinc-600 dark:text-zinc-300",
                  deleted && "text-xs text-zinc-500 italic dark:text-zinc-400"
                )}
              >
                {deleted ? "This message has been deleted" : content}
                {isUpdated && !deleted && (
                  <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                    edited
                  </span>
                )}
              </p>
            )}
            {content && isEditing && (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex w-full items-center gap-x-2 pt-2"
                  >
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="relative w-full">
                              <Input
                                disabled={isLoading}
                                className="textzinc-600 border-0 border-none bg-zinc-200/90 p-2 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                                placeholder="Edited message"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <ActionToolTip lable="Save" side="top" align="center">
                      <Button
                        size="sm"
                        variant={"primary"}
                        disabled={isLoading}
                      >
                        Save
                      </Button>
                    </ActionToolTip>
                  </form>
                  <span className="mt-1 text-[10px] text-zinc-400">
                    Press{" "}
                    <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                      Esc
                    </kbd>{" "}
                    to cancel and{" "}
                    <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                      Enter
                    </kbd>{" "}
                    to save
                  </span>
                </Form>
              </>
            )}
          </div>
        </div>
        {canDeleteMessage && (
          <>
            <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
              {canEditMessage && (
                <>
                  <ActionToolTip lable="Edit" side="top" align="center">
                    <Edit
                      onClick={() => setIsEditing(!isEditing)}
                      className="hidden size-4 cursor-pointer text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                    />
                  </ActionToolTip>
                </>
              )}
              <ActionToolTip lable="Delete" side="top" align="center">
                <Trash
                  onClick={() =>
                    onOpen("deleteMessage", {
                      apiURL: `${socketURL}/${id}`,
                      query: socketQuery,
                    })
                  }
                  className="hidden size-4 cursor-pointer text-rose-500 transition group-hover:block hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-500"
                />
              </ActionToolTip>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatItem;
