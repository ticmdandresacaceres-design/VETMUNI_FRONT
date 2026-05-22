"use client";

import { useAuthContext } from "@/src/features/auth/context/AuthContext";
import AdminLayoutClient from "@/src/features/layouts/AdminLayoutClient";
import VeterinariaLayoutClient from "@/src/features/layouts/VeterinariaLayoutClient";
import { AuthGuard } from "@/src/features/auth/context/AuthGuard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Cargando...</p>
            <p className="text-sm text-muted-foreground">Verificando permisos</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roles = user.role || [];
  const isAdmin = roles.includes("ADMIN");

  return (
    <AuthGuard requiredRoles={isAdmin ? ["ADMIN"] : ["VETERINARIAN", "OWNER"]}>
      {isAdmin ? (
        <AdminLayoutClient>{children}</AdminLayoutClient>
      ) : (
        <VeterinariaLayoutClient>{children}</VeterinariaLayoutClient>
      )}
    </AuthGuard>
  );
}
