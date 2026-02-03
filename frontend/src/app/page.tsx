
"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { MarketTable } from "@/components/dashboard/MarketTable";
import { TopCompanies } from "@/components/dashboard/TopCompanies";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NewsWidget } from "@/components/NewsWidget";

export default function Dashboard() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [marketRes, topRes] = await Promise.all([
          fetchAPI("/market-summary"),
          fetchAPI("/top-companies"),
        ]);

        if (marketRes.status === "success" && Array.isArray(marketRes.data)) {
          setMarketData(marketRes.data);
        }
        if (topRes.status === "success" && Array.isArray(topRes.data)) {
          setTopCompanies(topRes.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
        <div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-100px)]">
      {/* Main Content Area - Takes up 3 cols on lg screens */}
      <div className="space-y-6 md:col-span-2 lg:col-span-3 overflow-auto pr-2">
        <TopCompanies data={topCompanies} />
        <MarketTable data={marketData} />
      </div>

      {/* Right Sidebar / News Area - Takes up 1 col */}
      <div className="h-full hidden md:block">
        <NewsWidget />
      </div>
    </div>
  );
}
