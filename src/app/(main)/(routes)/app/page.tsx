// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { auth } from "@/auth";
import AppClientPage from "./AppClientPage";

export default async function AppPage() {
  const session = await auth();

  return <AppClientPage session={session} />;
}
