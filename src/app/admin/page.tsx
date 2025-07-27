
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await auth();
  const adminEmail = "kiba@kibaofficial.net";

  if (!session?.user?.email || session.user.email !== adminEmail) {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      approved: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return (
    <main className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin: User-Freigabe</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {users.length === 0 && (
            <div className="text-center text-muted-foreground py-8">Keine User gefunden.</div>
          )}
          <div className="flex flex-col gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-lg border p-4 bg-muted/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1">
                  <div className="font-semibold text-base flex gap-2 items-center">
                    {user.name}
                    {user.emailVerified ? (
                      <Badge variant="default">Verifiziert</Badge>
                    ) : (
                      <Badge variant="secondary">Nicht verifiziert</Badge>
                    )}
                    {user.approved ? (
                      <Badge variant="default">Freigeschaltet</Badge>
                    ) : (
                      <Badge variant="secondary">Nicht freigeschaltet</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs md:text-sm">{user.email}</div>
                  <div className="text-muted-foreground text-xs hidden md:block">{user.createdAt.toLocaleString?.() ?? String(user.createdAt)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {!user.approved && user.emailVerified && (
                    <form action="/admin/approve" method="POST">
                      <input type="hidden" name="userId" value={user.id} />
                      <Button type="submit" variant="primary" size="sm">
                        Freischalten
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
