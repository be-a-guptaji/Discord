// lib/conversation.ts

import { db } from "@/lib/db";

const findConversation = async (memberOneID: string, memberTwoID: string) => {
  // Find the conversation between memberOneId and memberTwoId
  try {
    return await db.coversation.findFirst({
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
  // Create a new conversation between memberOneId and memberTwoId
  try {
    return await db.coversation.create({
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
  // Find or create a conversation between memberOneId and memberTwoId
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
