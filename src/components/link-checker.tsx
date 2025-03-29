'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link, ExternalLink, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sidebar } from '@/components/sidebar';
import { ResultsDisplay } from '@/components/results-display';
import { crawlWebsite } from '@/lib/actions';

export type CrawlResult = {
    id: string
    url: string
    date: string
    results: {
        url: string
        sourceUrl: string
        status: number
        ok: boolean
    }[]
}

export function LinkChecker() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get('id');

    const [ url, setUrl ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ crawlHistory, setCrawlHistory ] = useState<CrawlResult[]>([]);
    const [ currentCrawl, setCurrentCrawl ] = useState<CrawlResult | null>(null);

    // Load crawl history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('crawlHistory');

        if (savedHistory) {
            const history = JSON.parse(savedHistory);

            setCrawlHistory(history);

            // If there's a selected ID in the URL, load that crawl
            if (!selectedId)
                return;

            const selected = history.find((item: CrawlResult) => item.id === selectedId);

            if (selected)
                setCurrentCrawl(selected);
        }
    }, [ selectedId ]);

    // Save crawl history to localStorage whenever it changes
    useEffect(() => {
        if (crawlHistory.length < 0)
            return;

        localStorage.setItem('crawlHistory', JSON.stringify(crawlHistory));
    }, [ crawlHistory ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) return;

        try {
            setIsLoading(true);

            // Normalize URL if needed
            let normalizedUrl = url;

            if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://'))
                normalizedUrl = 'https://' + normalizedUrl;

            const results = await crawlWebsite(normalizedUrl);
            const newCrawl: CrawlResult = {
                id: Date.now().toString(),
                url: normalizedUrl,
                date: new Date().toISOString(),
                results,
            };

            // Update state with new crawl
            setCurrentCrawl(newCrawl);
            setCrawlHistory(prev => [ newCrawl, ...prev ]);

            // Update URL to include the new crawl ID
            router.push(`?id=${newCrawl.id}`);
        } catch (error) {
            console.error('Error crawling website:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHistoryItemClick = (id: string) => {
        const selected = crawlHistory.find((item) => item.id === id);

        if (selected) {
            setCurrentCrawl(selected);
            router.push(`?id=${id}`);
        }
    };

    return (
        <>
            <Sidebar crawlHistory={crawlHistory} selectedId={selectedId} onItemClick={handleHistoryItemClick} />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Broken Link Checker</h1>
                    <p className="text-muted-foreground">
                        Check your website for broken links and fix them to improve user experience.
                    </p>
                </div>
                <Tabs defaultValue="check" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="check">Check Links</TabsTrigger>
                        <TabsTrigger value="results" disabled={!currentCrawl}>
                            Results
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="check" className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" disabled={isLoading || !url}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Checking
                                            </>
                                        ) : (
                                            <>
                                                <Link className="mr-2 h-4 w-4" />
                                                Check Links
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                        {currentCrawl && (
                            <div className="rounded-md border p-4">
                                <h2 className="font-semibold flex items-center">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Latest Results
                                </h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {new Date(currentCrawl.date).toLocaleString()}
                                </p>
                                <ResultsDisplay results={currentCrawl.results} />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="results" className="space-y-4">
                        {currentCrawl && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{currentCrawl.url}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Crawled on {new Date(currentCrawl.date).toLocaleString()}
                                    </p>
                                </div>
                                <ResultsDisplay results={currentCrawl.results} />
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
