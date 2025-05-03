// lib/conversation.ts

import { db } from "@/lib/db";

const findConversation = async (memberOneID: string, memberTwoID: string) => {
  // Find the conversation between memberOneID and memberTwoID
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneID }, { memberTwoID }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    // Handle error and return null
    return null;
  }
};

const createNewConversation = async (
  memberOneID: string,
  memberTwoID: string
) => {
  // Create a new conversation between memberOneID and memberTwoID
  try {
    return await db.conversation.create({
      data: {
        memberOneID,
        memberTwoID,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    // Handle error and return null
    return null;
  }
};

export const getOrCreateConversation = async (
  memberOneID: string,
  memberTwoID: string
) => {
  // Find or create a conversation between memberOneID and memberTwoID
  const conversation =
    (await findConversation(memberOneID, memberTwoID)) ||
    (await findConversation(memberTwoID, memberOneID));

  // If conversation is NULL, create a new one
  if (!conversation) {
    return await createNewConversation(memberOneID, memberTwoID);
  }

  // Return the conversation
  return conversation;
};
