// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { UploadButton } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "profileImage" | "messageFile";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [ type, setType ] = useState<string>("");
  // console.log("File type:", type);
  // console.log("File value:", value);

  if (value && type !== "pdf" ) {
    return (
      <div className="relative h-20 w-20">
        <div className="h-full w-full bg-background/10 rounded-md flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Datei hochgeladen</span>
        </div>
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400 absolute top-2 left-2" />
        <span className="text-xs text-indigo-500 dark:text-indigo-400 absolute bottom-1 left-1">
          {fileName || value.split("/").pop()}
        </span>
        <button
          onClick={() => {
            onChange("");
            setFileName("");
          }}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && type === "pdf") {
    // Zeige echten Dateinamen, falls vorhanden, sonst letzten Teil der URL
    const displayName = fileName || value.split("/").pop();
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {displayName}
        </a>
        <button
          onClick={() => {
            onChange("");
            setFileName("");
          }}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].ufsUrl);
        setFileName(res?.[0].name || "");
        if (res?.[0].name.split(".").length > 1) {
          const fileType = res[0].name.split(".").pop()?.toLowerCase();
          setType(fileType || "");
          }
      }}
      onUploadError={(error: Error) => {
      }}
    />
  );
}