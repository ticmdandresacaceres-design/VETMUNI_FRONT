import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function DuenoPageDetailsSkeleton() {
    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-10 h-10" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="ml-auto h-6 w-20" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main info skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-48" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Pets skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Summary skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-24" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DuenoPageDetailsSkeleton;