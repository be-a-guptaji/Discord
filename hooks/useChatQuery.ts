// hooks/useChatQuery.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { useSocket } from "@/components/providers/socketProvider";

interface ChatQueryProps {
  queryKey: string;
  apiURL: string;
  paramValue: string;
  paramKey: "channelID" | "conversationID";
}

export const useChatQuery = ({
  queryKey,
  apiURL,
  paramValue,
  paramKey,
}: ChatQueryProps) => {
  // Get the connection status from the socket provider
  const { isConnected } = useSocket();

  // Funtion to fetch the messages
  const fetchMessages = async ({ pageParam = null }) => {
    // Build the API URL for creating a channel, including optional serverID as a query parameter
    const URL = qs.stringifyUrl(
      {
        url: apiURL,
        query: { cursor: pageParam, [paramKey]: paramValue },
      },
      { skipNull: true }
    );

    // Make a GET request to fetch messages
    const response = await fetch(URL);

    // If the connection is not active or the response is not ok, return an empty array
    if (!isConnected || !response.ok) {
      return [];
    }

    // If the response is ok, return the data
    return response.json();
  };

  const { data, hasNextPage, isFetchingNextPage, status, fetchNextPage } =
    useInfiniteQuery({
      initialPageParam: null, // or 0 or '' depending on your pagination logic
      queryKey: [queryKey],
      refetchInterval: isConnected ? false : 1000,
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    });

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  };
};
