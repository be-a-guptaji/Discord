// components/providers/modalProvider.tsx

"use client";

import CreateServerModal from "@/components/modals/createServerModal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  // This is to avoid hydration error
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
    </>
  );
};
