// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Suspense } from "react";
import ImprintClient from "./imprintClient";

export default function ImprintPage() {
  return (
    <Suspense fallback={<div className="text-center text-white py-12">Loading...</div>}>
      <ImprintClient />
    </Suspense>
  );
}

