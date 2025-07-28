// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={'h-full'}>
      <main className="h-full bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;