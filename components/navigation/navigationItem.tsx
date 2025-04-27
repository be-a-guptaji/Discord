// components/navigation/navigationItem.tsx

"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionToolTip from "@/components/actionToolTip";

interface NavigationItemProps {
  id: string;
  name: string;
  imageURL: string;
}

const NavigationItem = ({ id, name, imageURL }: NavigationItemProps) => {
  // Navigation hook
  const router = useRouter();

  // Params hook
  const params = useParams();

  // Handle the click event to navigate to the server page
  const onClick = () => {
    router.push(`/server/${id}`);
  };

  return (
    <>
      <ActionToolTip lable={name} side="right" align="center">
        <button onClick={onClick} className="group relative flex items-center">
          <div
            className={cn(
              "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
              params.serverID === id ? "h-[36px]" : "h-0 group-hover:h-[20px]"
            )}
          />
          <div
            className={cn(
              "group relative mx-3 flex size-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
              params.serverID === id &&
                "bg-primary/10 text-primary rounded-[16px]"
            )}
          >
            <Image
              fill
              priority
              src={imageURL}
              alt="Channel"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </button>
      </ActionToolTip>
    </>
  );
};

export default NavigationItem;
