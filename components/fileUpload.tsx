// component/fileUpload.tsx This component handle the UI and logic for file upload

"use client";

import { FileIcon, Mic, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  gettingFileType?: boolean;
  getFileType?: (fileType: string | null | undefined) => void;
  onChange: (fileUrl?: string) => void;
}

const FileUpload = ({
  endpoint,
  value,
  gettingFileType = false,
  onChange,
  getFileType,
}: FileUploadProps) => {
  // Extract the file Type
  const [fileType, setFileType] = useState<string | null>();

  // This is the modal store for opening and closing the modal and getting the type of modal
  const { type } = useModal();

  // Function to handle video upload
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

  // Function to handle audio upload
  if (value && fileType === "mp3") {
    return (
      <>
        <div className="bg-background/10 relative mt-2 flex items-center rounded-md p-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-sm text-indigo-500 hover:underline dark:text-indigo-400"
          >
            <Mic className="size-10 fill-indigo-200 stroke-indigo-400" />
            <audio controls autoPlay src={value} />
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

  // Function to handle pdf upload
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

  // Function to handle image upload on message
  if (value && type === "messageFile") {
    return (
      <>
        <div className="relative">
          <Image
            priority
            src={value}
            alt="Upload"
            width={500}
            height={500}
            className="aspect-square w-[300px] rounded-md object-fill"
          />
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

  // Function to handle image upload
  if (value) {
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
          setFileType(res?.[0]?.name?.split(".").pop());
          if (gettingFileType && getFileType) {
            getFileType(res?.[0]?.name?.split(".").pop());
          }
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
