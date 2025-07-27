// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// auth/verify/page.tsx
// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// DIESE BEIDEN ZEILEN HINZUFÜGEN:
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { VerificationForm } from "@/components/auth/VerificationForm";

const NewVerificationPage = () => {
  return <VerificationForm />;
}

export default NewVerificationPage;