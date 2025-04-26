// components/modals/initialModal.tsx

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/fileUpload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// This is the schema for the form
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageURL: z.string().url({
    message: "Image is required",
  }),
});

const InitialModal = () => {
  // Navigation hook
  const router = useRouter();
  // This is to avoid hydration error
  const [isMounted, setIsMounted] = useState(false);

  // This is the form value and validation from react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageURL: "",
    },
  });

  // This is the loading state for the form
  const isLoading = form.formState.isSubmitting;

  // This is the submit function for the form
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Make a POST request to create a server
      await axios.post("/api/servers", data);

      // Reset the form after submission
      form.reset();

      // Refresh the page after submission
      router.refresh();

      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      // Handle error
      console.error("Error creating server:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Dialog open>
        <DialogContent
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Initial Modal for new users"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Create your first server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your server a personality with a name and an image. You can
              always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="imageURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter server name"
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

export default InitialModal;
