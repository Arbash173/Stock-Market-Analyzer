
"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { MarketSummaryItem, TopCompany } from "@/types";
import { MarketTable } from "@/components/dashboard/MarketTable";
import { TopCompanies } from "@/components/dashboard/TopCompanies";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [marketData, setMarketData] = useState<MarketSummaryItem[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, topRes] = await Promise.all([
          fetchAPI("/market-summary"),
          fetchAPI("/top-companies"),
        ]);

        if (summaryRes.status === "success" && Array.isArray(summaryRes.data)) {
          setMarketData(summaryRes.data);
        }
        if (topRes.status === "success" && Array.isArray(topRes.data)) {
          setTopCompanies(topRes.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <TopCompanies data={topCompanies} />
      <MarketTable data={marketData} />
    </div>
  );
}
