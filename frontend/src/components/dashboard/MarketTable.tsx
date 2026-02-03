
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MarketSummaryItem } from "@/types";
import { Search } from "lucide-react";

interface MarketTableProps {
    data: MarketSummaryItem[];
}

export function MarketTable({ data }: MarketTableProps) {
    const [search, setSearch] = useState("");

    const filteredData = data.filter((item) =>
        item.SCRIP.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Market Data</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter stocks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 w-[250px]"
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                            <TableHead className="text-right">High</TableHead>
                            <TableHead className="text-right">Low</TableHead>
                            <TableHead className="text-right">Volume</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <TableRow key={item.SCRIP}>
                                    <TableCell className="font-medium">{item.SCRIP}</TableCell>
                                    <TableCell className="text-right">
                                        {Number(item.CURRENT).toFixed(2)}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right ${Number(item.CHANGE) > 0
                                                ? "text-green-600"
                                                : Number(item.CHANGE) < 0
                                                    ? "text-red-600"
                                                    : ""
                                            }`}
                                    >
                                        {item.CHANGE ? Number(item.CHANGE).toFixed(2) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">{Number(item.HIGH).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{Number(item.LOW).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.VOLUME.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
