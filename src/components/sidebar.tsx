'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Globe, ChevronDown, ChevronUp, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { CrawlResult } from '@/components/link-checker';

interface SidebarProps {
    crawlHistory: CrawlResult[]
    selectedId: string | null
    onItemClick: (id: string) => void
}

export function Sidebar({ crawlHistory, selectedId, onItemClick }: SidebarProps) {
    const [ isOpen, setIsOpen ] = useState(true);
    const [ isMobileOpen, setIsMobileOpen ] = useState(false);

    // Group crawl history by date
    const groupedHistory: Record<string, CrawlResult[]> = {};

    crawlHistory.forEach((item) => {
        const date = new Date(item.date).toLocaleDateString();

        if (!groupedHistory[date])
            groupedHistory[date] = [];

        groupedHistory[date].push(item);
    });

    return (
        <>
            {/* Mobile sidebar toggle */}
            <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 z-40 rounded-full shadow-md md:hidden"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                <PanelLeft className="h-4 w-4" />
            </Button>

            {/* Sidebar for mobile */}
            <div
                className={cn(
                    'fixed inset-0 z-30 bg-background/80 backdrop-blur-sm transition-all md:hidden',
                    isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={() => setIsMobileOpen(false)}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-30 w-72 border-r bg-background transition-transform md:static md:w-auto',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                )}
            >
                <div className="flex h-16 items-center border-b px-4">
                    <h2 className="text-lg font-semibold">Crawl History</h2>
                    <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setIsMobileOpen(false)}>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Previous Crawls</h3>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <Separator className="my-2" />
                        <CollapsibleContent>
                            <ScrollArea className="h-[calc(100vh-10rem)]">
                                {Object.keys(groupedHistory).length > 0 ? (
                                    <div className="space-y-6">
                                        {Object.entries(groupedHistory).map(([ date, items ]) => {
                                            const [stringDay, stringMonth, stringYear] = date.split('/');
                                            const [ d, m, y ] = [ parseInt(stringDay), parseInt(stringMonth), parseInt(stringYear) ];
                                            const formattedDate =  format(new Date(y, m, d), 'yyyy-MM-dd')

                                            return (
                                                <div key={date} className="space-y-2">
                                                    <h4 className="text-xs font-medium text-muted-foreground">
                                                        {formattedDate}
                                                    </h4>
                                                    <div className="space-y-1">
                                                        {items.map((item) => (
                                                            <Button
                                                                key={item.id}
                                                                variant="ghost"
                                                                className={cn(
                                                                    'w-full justify-start text-left text-sm',
                                                                    selectedId === item.id && 'bg-accent',
                                                                )}
                                                                onClick={() => {
                                                                    onItemClick(item.id);
                                                                    setIsMobileOpen(false);
                                                                }}
                                                            >
                                                                <Globe className="mr-2 h-4 w-4" />
                                                                <span className="truncate">{new URL(item.url).hostname}</span>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-4 text-center text-sm text-muted-foreground">No crawl history yet</div>
                                )}
                            </ScrollArea>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </aside>
        </>
    );
}
