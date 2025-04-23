// component/actionToolTip.tsx

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionToolTipProps {
  lable: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const ActionToolTip = ({
  lable,
  children,
  side,
  align,
}: ActionToolTipProps) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side={side} align={align}>
            <p className="text-sm font-semibold capitalize">
              {lable.toLowerCase()}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default ActionToolTip;
