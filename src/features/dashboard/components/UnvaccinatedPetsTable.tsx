"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PawPrint, Phone, User } from "lucide-react";
import { useUnvaccinatedPets } from "@/src/features/dashboard/hooks/useStats";
import { formatDate } from "@/src/lib/utils/utils";

export function UnvaccinatedPetsTable() {
  const { data, isLoading } = useUnvaccinatedPets();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PawPrint className="h-5 w-5 text-orange-500" />
              Mascotas Sin Vacunar
            </CardTitle>
            <CardDescription>Mascotas que no tienen vacunas registradas</CardDescription>
          </div>
          {data && (
            <Badge variant="secondary">{data.length} registros</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PawPrint className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No hay mascotas sin vacunar</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Especie</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>{pet.species}</TableCell>
                    <TableCell>{pet.race}</TableCell>
                    <TableCell>{formatDate(pet.registered_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {pet.owner.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {pet.owner.phone}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
