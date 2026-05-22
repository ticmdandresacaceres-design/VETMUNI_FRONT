"use client";

import { useAuthContext } from "@/src/features/auth/context/AuthContext";
import AdminDashboardContent from "@/src/features/admin/components/AdminDashboardContent";
import NewDashboardContent from "@/src/features/dashboard/components/NewDashboardContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (!user) {
    return null;
  }

  const roles = user.role || [];
  const isAdmin = roles.includes("ADMIN");

  return isAdmin ? <AdminDashboardContent /> : <NewDashboardContent />;
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-32 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
