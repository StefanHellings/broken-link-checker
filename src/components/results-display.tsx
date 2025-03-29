'use client';

import { useState } from 'react';
import { Check, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  results: {
    url: string
    sourceUrl: string
    status: number
    ok: boolean
  }[]
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
    const [ filter, setFilter ] = useState<'all' | 'broken' | 'ok'>('all');
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ isFiltersOpen, setIsFiltersOpen ] = useState(false);

    // Count broken and working links
    const brokenCount = results.filter((result) => !result.ok).length;
    const workingCount = results.filter((result) => result.ok).length;

    // Filter results based on current filter and search term
    const filteredResults = results.filter((result) => {
    // Apply status filter
        if (filter === 'broken' && result.ok) return false;
        if (filter === 'ok' && !result.ok) return false;

        // Apply search filter if there's a search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();

            return result.url.toLowerCase().includes(term) || result.sourceUrl.toLowerCase().includes(term);
        }

        return true;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-foreground">
          Total: {results.length}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
          Working: {workingCount}
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
          Broken: {brokenCount}
                </Badge>
            </div>

            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
            Filters
                        {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Search by URL..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
              All
                        </Button>
                        <Button variant={filter === 'broken' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('broken')}>
              Broken Only
                        </Button>
                        <Button variant={filter === 'ok' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ok')}>
              Working Only
                        </Button>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {filteredResults.length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead>Link URL</TableHead>
                                <TableHead className="hidden md:table-cell">Found On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResults.map((result, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {result.ok ? (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                                                >
                                                    <Check className="mr-1 h-3 w-3" />
                                                    {result.status}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
                                                    <X className="mr-1 h-3 w-3" />
                                                    {result.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate max-w-[200px] md:max-w-[300px]">{result.url}</span>
                                            <a
                                                href={result.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
                                                    !result.ok && 'text-muted-foreground hover:text-muted-foreground',
                                                )}
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate max-w-[200px] md:max-w-[300px]">{result.sourceUrl}</span>
                                            <a
                                                href={result.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="rounded-md border p-8 text-center">
                    <p className="text-muted-foreground">No results found</p>
                </div>
            )}
        </div>
    );
}
