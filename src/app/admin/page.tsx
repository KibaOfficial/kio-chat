
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadButtonTestCardWithTimeout } from "@/components/admin/UploadButtonTestCard";
import { CheckCircle2, XCircle, Mail, Calendar, Users, Shield } from "lucide-react";

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

  const stats = {
    total: users.length,
    approved: users.filter(u => u.approved).length,
    verified: users.filter(u => u.emailVerified).length,
    pending: users.filter(u => !u.approved && u.emailVerified).length,
  };

  return (
    <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">User-Verwaltung und System-Übersicht</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Gesamt Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Freigeschaltet</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-accent">{stats.verified}</p>
                <p className="text-sm text-muted-foreground">E-Mail verifiziert</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-error/20 bg-error/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-error" />
              <div>
                <p className="text-2xl font-bold text-error">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Wartet auf Freigabe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            User-Freigabe
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {users.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Keine User gefunden.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const isVerified = !!user.emailVerified;
                const isApproved = user.approved;
                const needsApproval = isVerified && !isApproved;
                
                return (
                  <div
                    key={user.id}
                    className={`group relative rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
                      needsApproval 
                        ? 'border-error/20 bg-error/5 hover:border-error/30' 
                        : isApproved 
                        ? 'border-success/20 bg-success/5 hover:border-success/30'
                        : 'border-border bg-card hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            isApproved ? 'bg-success/20' :
                            isVerified ? 'bg-error/20' : 'bg-muted'
                          }`}>
                            {isApproved ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : isVerified ? (
                              <XCircle className="h-5 w-5 text-error" />
                            ) : (
                              <Mail className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-foreground">{user.name}</h3>
                              <div className="flex gap-2">
                                {isVerified ? (
                                  <Badge className="bg-success/20 text-success border-success/30">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    E-Mail verifiziert
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <Mail className="h-3 w-3 mr-1" />
                                    Nicht verifiziert
                                  </Badge>
                                )}
                                {isApproved ? (
                                  <Badge className="bg-primary/20 text-primary border-primary/30">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Freigeschaltet
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-error/30 text-error">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Wartet auf Freigabe
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Registriert: {new Date(user.createdAt).toLocaleDateString('de-DE', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        {!isVerified && (
                          <form action="/admin/resend-verification" method="POST">
                            <input type="hidden" name="userId" value={user.id} />
                            <Button 
                              type="submit" 
                              variant="outline"
                              size="sm"
                              className="border-primary/30 text-primary hover:bg-primary/10"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Code neu senden
                            </Button>
                          </form>
                        )}
                        
                        {needsApproval && (
                          <form action="/admin/approve" method="POST">
                            <input type="hidden" name="userId" value={user.id} />
                            <Button 
                              type="submit" 
                              className="bg-success hover:bg-success/90 text-white"
                              size="sm"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Freischalten
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-muted-foreground">Development Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadButtonTestCardWithTimeout />
        </CardContent>
      </Card>
    </main>
  );
}