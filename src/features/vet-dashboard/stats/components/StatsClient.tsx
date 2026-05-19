'use client';

import { 
    useDashboardStats, 
    useMonthlyActivity, 
    useSpeciesDistribution 
} from '../hooks/useStats';
import { StatsOverview } from './StatsOverview';
import { PetSpeciesChart } from './PetSpeciesChart';
import { VaccinesPerMonthChart } from './VaccinesPerMothChart';
import { PetsRegistrationChart } from './PetsRegistrationChart';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function StatsClient() {
    const { 
        data: dashboardStats, 
        isLoading: isDashboardLoading, 
        error: dashboardError, 
        refetch: refetchDashboard 
    } = useDashboardStats();

    const {
        data: monthlyActivity,
        isLoading: isMonthlyLoading,
        error: monthlyError,
        refetch: refetchMonthly
    } = useMonthlyActivity();

    const {
        data: speciesDistribution,
        isLoading: isSpeciesLoading,
        error: speciesError,
        refetch: refetchSpecies
    } = useSpeciesDistribution();

    const isLoading = isDashboardLoading || isMonthlyLoading || isSpeciesLoading;
    const error = dashboardError || monthlyError || speciesError;

    const refetchAll = () => {
        refetchDashboard();
        refetchMonthly();
        refetchSpecies();
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Error al cargar las estadísticas: {(error as Error).message}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard de Estadísticas</h1>
                <Button 
                    onClick={refetchAll} 
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {isLoading && !dashboardStats ? (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {dashboardStats && <StatsOverview stats={dashboardStats} />}
                    <div className="grid gap-6 md:grid-cols-2">
                        {speciesDistribution && <PetSpeciesChart data={speciesDistribution} />}
                        {monthlyActivity && <VaccinesPerMonthChart data={monthlyActivity} />}
                    </div>
                    {monthlyActivity && <PetsRegistrationChart data={monthlyActivity} />}
                </>
            )}
        </div>
    );
}

export default StatsClient;