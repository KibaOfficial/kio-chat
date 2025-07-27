// VerificationForm.tsx
// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"

import { Verification } from "@/lib/auth/verify";
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import { Card, CardHeader } from "../ui/card";
import { Loader2, Lock } from "lucide-react";

// Separate Komponente für die Verification Logic
const VerificationContent = () => {
  const [ error, setError ] = useState<string | undefined>();
  const [ success, setSuccess ] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      toast.error("Verification token is missing.");
      return;
    }

    Verification(token)
      .then((result) => {
        if (result.error) {
          setError(result.error);
          setSuccess(undefined);
          toast.error(result.error);
          console.error("Verification error:", result.error);
        } else {
          setSuccess(result.message);
          setError(undefined);
          toast.success("Email verified successfully!");
        }
      })
      .catch((error) => {
        console.error("Verification error:", error);
        toast.error("An unexpected error occurred during verification.");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-slate-700/50 shadow-2xl rounded-2xl">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-3 items-center justify-center">
          <div className="flex items-center justify-center mb-4">
            <Lock className="text-7xl text-blue-500 drop-shadow-lg" />
            <h1 className="text-5xl font-extrabold text-white ml-3 select-none">
              Verification
            </h1>
          </div>
          <p className="text-gray-300 text-center text-base font-medium">
            Confirming your email verification status...
          </p>
        </div>
      </CardHeader>
      <div className="mt-6 flex items-center justify-center min-h-[60px]">
        {!success && !error && (
          <Loader2 className="animate-spin text-blue-400 w-8 h-8" />
        )}
        {success && (
          <p className="text-green-400 font-semibold text-center text-lg px-4">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-500 font-semibold text-center text-lg px-4">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
};

// Loading Fallback
const VerificationLoading = () => (
  <Card className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-slate-700/50 shadow-2xl rounded-2xl">
    <CardHeader>
      <div className="w-full flex flex-col gap-y-3 items-center justify-center">
        <div className="flex items-center justify-center mb-4">
          <Lock className="text-7xl text-blue-500 drop-shadow-lg" />
          <h1 className="text-5xl font-extrabold text-white ml-3 select-none">
            Verification
          </h1>
        </div>
        <p className="text-gray-300 text-center text-base font-medium">
          Loading verification...
        </p>
      </div>
    </CardHeader>
    <div className="mt-6 flex items-center justify-center min-h-[60px]">
      <Loader2 className="animate-spin text-blue-400 w-8 h-8" />
    </div>
  </Card>
);

// Hauptkomponente mit Suspense INNERHALB der Client Component
export const VerificationForm = () => {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerificationContent />
    </Suspense>
  );
}