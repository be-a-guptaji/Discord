// component/navigation/navigationAction.tsx

"use client";

import { Plus } from "lucide-react";
import ActionToolTip from "@/components/actionToolTip";
import { useModalStore } from "@/hooks/useModalStore";

const NavigationAction = () => {
  // This is the modal store for opening and closing the modal and getting the type of modal
  const { onOpen } = useModalStore();

  return (
    <>
      <div>
        <ActionToolTip lable="Create Server" side="right" align="center">
          <button
            className="group flex items-center"
            onClick={() => onOpen("createServer")}
          >
            <div className="mx-3 flex size-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-zinc-400/50 transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700 dark:group-hover:bg-emerald-500">
              <Plus
                className="text-emerald-500 transition group-hover:text-white"
                size={25}
              />
            </div>
          </button>
        </ActionToolTip>
      </div>
    </>
  );
};

export default NavigationAction;
