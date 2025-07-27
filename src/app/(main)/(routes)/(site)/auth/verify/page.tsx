// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { Suspense } from "react";
import { VerificationForm } from "@/components/auth/VerificationForm";

const NewVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationForm />
    </Suspense>
  );
}

export default NewVerificationPage;