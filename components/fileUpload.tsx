// component/fileUpload.tsx This component handle the UI and logic for file upload

"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (fileUrl?: string) => void;
}

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  // Extract the file Type
  const fileType = value?.split(".").pop();

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
