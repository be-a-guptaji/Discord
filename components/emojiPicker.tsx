// components/emojiPicker.tsx

"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  // Use the resolvedTheme from next-themes
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Smile className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
        </PopoverTrigger>
        <PopoverContent
          side="right"
          sideOffset={40}
          className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
        >
          <Picker
            data={data}
            theme={resolvedTheme}
            onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default EmojiPicker;
