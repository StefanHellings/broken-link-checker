import { Suspense } from 'react';
import { LinkChecker } from '@/components/link-checker';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <div className="container grid flex-1 items-start gap-4 py-6 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] lg:gap-8">
                    <Suspense fallback={<Skeleton className="h-[calc(100vh-2rem)] w-full" />}>
                        <LinkChecker />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
