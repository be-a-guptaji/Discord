// component/fileUpload.tsx This component handle the UI and logic for file upload

"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (fileUrl?: string) => void;
}

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  // Extract the file Type
  const [fileType, setFileType] = useState<string>("");

  if (value && fileType === "mp4") {
    return (
      <>
        <div className="bg-background/10 relative mt-2 flex items-center rounded-md">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-sm text-indigo-500 hover:underline dark:text-indigo-400"
          >
            <video
              src={value}
              className="aspect-video w-[390px] rounded-md"
              autoPlay={true}
              muted
              controls={false}
            />
          </a>
          <button
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      </>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <>
        <div className="bg-background/10 relative mt-2 flex items-center rounded-md p-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center justify-center text-sm text-indigo-500 hover:underline dark:text-indigo-400"
          >
            <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
            <p className="w-[390px] truncate text-wrap">{value}</p>
          </a>
          <button
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      </>
    );
  }

  if (value && fileType !== "pdf") {
    return (
      <>
        <div className="relative size-20">
          <Image
            fill
            priority
            src={value}
            alt="Upload"
            className="rounded-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-0 right-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].ufsUrl);
          setFileType(res?.[0]?.name?.split(".").pop() || "");
        }}
        onUploadError={(err: Error) => {
          // Do something with the error.
          console.error("Upload Error", err);
        }}
      />
    </>
  );
};

export default FileUpload;
