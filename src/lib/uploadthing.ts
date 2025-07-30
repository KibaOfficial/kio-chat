// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
export const { UploadButton, UploadDropzone } = {
  UploadButton: generateUploadButton<OurFileRouter>(),
  UploadDropzone: generateUploadDropzone<OurFileRouter>()
};