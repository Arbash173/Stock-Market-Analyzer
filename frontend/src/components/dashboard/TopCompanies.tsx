
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopCompany } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";

interface TopCompaniesProps {
    data: TopCompany[];
}

export function TopCompanies({ data }: TopCompaniesProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Market Movers (Top Volume)</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data.map((item) => (
                    <Link href={`/stock/${item.SCRIP}`} key={item.SCRIP} className="block transition-transform hover:scale-105">
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {item.SCRIP}
                                </CardTitle>
                                {item.CHANGE > 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : item.CHANGE < 0 ? (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                ) : (
                                    <Minus className="h-4 w-4 text-muted-foreground" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{Number(item.CURRENT).toFixed(2)}</div>
                                <p className={`text-xs ${item.CHANGE > 0 ? "text-green-600" : item.CHANGE < 0 ? "text-red-600" : "text-muted-foreground"
                                    }`}>
                                    {item.CHANGE > 0 ? "+" : ""}{Number(item.CHANGE).toFixed(2)} ({((item.CHANGE / (item.CURRENT - item.CHANGE)) * 100).toFixed(2)}%)
                                </p>
                                <div className="mt-2 text-xs text-muted-foreground">Vol: {item.VOLUME.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
