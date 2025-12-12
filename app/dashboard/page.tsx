"use client";

import React, {useEffect, useState} from "react";
import LineChartOne from "@/components/ui/charts/line/LineChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {isValidPrice, roundToTickSET} from "@/lib/utils";
import ChartTabResilient from "@/components/common/ChartTabResilient";
import { ChartRange, CHART_API_PARAMS } from "@/lib/constants";
export default function LineChart() {
    const [symbol, setSymbol] = useState<string>();
    const [seriesData, setSeries] = useState<ApexAxisChartSeries>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [prevClose, setPrevClose] = useState<number | null>(null);
    const [range, setRange] = useState<ChartRange>("1d");
    useEffect(() => {
        async function loadMarketData() {
            try {
                setLoading(true);

                const { interval, range: apiRange } = CHART_API_PARAMS[range];

                console.log("📡 Fetching:", interval, apiRange);

                const res = await fetch("/api/market-data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "BTS",
                        country: "BK",
                        interval,
                        range: apiRange,
                    }),
                });

                if (!res.ok) throw new Error("Failed to load market data");

                const data = await res.json();
                if (!data?.graph?.close || !data?.graph?.timestamp) return;

                const dataSeries = data.graph.timestamp
                    .map((t: number, i: number) => {
                        const raw = data.graph.close[i];
                        if (!isValidPrice(raw)) return null;
                        return { x: t * 1000, y: roundToTickSET(raw) };
                    })
                    .filter((p): p is { x: number; y: number } => p !== null);

                setSymbol(data.symbol);
                setSeries([{ name: data.symbol, data: dataSeries }]);
                setCategories(
                    data.graph.timestamp.map((t: number) =>
                        new Intl.DateTimeFormat("th-TH", {
                            timeZone: "Asia/Bangkok",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }).format(new Date(t * 1000))
                    )
                );
                setPrevClose(data.previousClose);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        loadMarketData();
    }, [range]);

    return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
          <ComponentCard title={`Line Chart (${symbol})`}>
                  <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                      <div className="w-full">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                              Statistics
                          </h3>
                          {/*<p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">*/}
                          {/*    Target you’ve set for each month*/}
                          {/*</p>*/}
                      </div>
                      <div className="flex items-start w-full gap-3 sm:justify-end">
                          <ChartTabResilient
                              value={range}
                              onChange={setRange}
                              chartParams={CHART_API_PARAMS}
                          />
                      </div>
                  </div>
          <LineChartOne  series={seriesData}
                         categories={categories}
                         prevClose={prevClose}
                         loading={loading}
                         error={error}
                         />
        </ComponentCard>


      </div>
    </div>
  );
}
