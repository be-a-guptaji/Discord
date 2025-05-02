// hooks/useChatScroll.ts

"use client";

import { useEffect, useState } from "react";

type ChatScrollProps = {
  count: number;
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
};

export const useChatScroll = ({
  count,
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
}: ChatScrollProps) => {
  // State to track if the component has been initialized
  const [hasInitialized, setHasInitialized] = useState(false);

  // useEffect hook to handle scroll behavior
  useEffect(() => {
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && hasInitialized && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, chatRef, hasInitialized, loadMore]);

  // useEffect hook to handle initialization
  useEffect(() => {
    const topDiv = chatRef?.current;
    const bottomDiv = bottomRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return !!distanceFromBottom;
    };

    // Scroll to the bottom of the chat
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 1000);
    }
  }, [bottomRef, chatRef, hasInitialized, count]);
};
