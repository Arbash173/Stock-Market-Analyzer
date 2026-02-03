
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { StockChart } from "@/components/StockChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function StockDetailPage() {
    const params = useParams();
    const symbol = params.symbol as string;

    const [historicData, setHistoricData] = useState<any[]>([]);
    const [predictionData, setPredictionData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Default relative date range: last 1 year
                const endDate = new Date();
                const startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);

                const formatDate = (date: Date) => date.toISOString().split('T')[0];

                const payload = {
                    symbol: symbol,
                    start_date: formatDate(startDate),
                    end_date: formatDate(endDate)
                };

                const histRes = await fetchAPI("/historic-data", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

                if (histRes.status === "success" && Array.isArray(histRes.data)) {
                    setHistoricData(histRes.data);
                } else {
                    // If API returns error (e.g. no data), handle gracefully
                    if (histRes.message) setError(histRes.message);
                }

                // Fetch predictions (might fail if not enough data)
                try {
                    const predRes = await fetchAPI("/prediction", {
                        method: "POST",
                        body: JSON.stringify(payload)
                    });
                    if (predRes.status === "success" && Array.isArray(predRes.data)) {
                        setPredictionData(predRes.data);
                    }
                } catch (e) {
                    console.warn("Prediction fetch failed", e);
                }

            } catch (err: any) {
                setError(err.message || "Failed to fetch stock data");
            } finally {
                setLoading(false);
            }
        }

        if (symbol) {
            fetchData();
        }
    }, [symbol]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-20">
                <div className="text-red-500 font-medium">Error loading data: {error}</div>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    // Combine historic and prediction for a continuous view if desired, 
    // but for now let's show them separately or just historic.

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{symbol}</h1>
                <p className="text-muted-foreground">Historical Performance</p>
            </div>

            <StockChart data={historicData} title="Price History" color="#2563eb" />

            {predictionData.length > 0 && (
                <StockChart data={predictionData} title="AI Prediction (Next 30 Days)" color="#9333ea" />
            )}
        </div>
    );
}
