"use client";

import React, {useEffect, useState} from "react";
import LineChartOne from "@/components/ui/charts/line/LineChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {isValidPrice, roundToTickSET} from "@/lib/utils";
import ChartTabResilient from "@/components/common/ChartTabResilient";
import {ChartRange, CHART_API_PARAMS} from "@/lib/constants";
import BasicTableOne_main from "@/components/ui/tables/BasicTableOne";

export default function LineChart() {
    const [symbol, setSymbol] = useState<string>();
    const [seriesData, setSeries] = useState<ApexAxisChartSeries>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [avgProfitNegative, setRegularMarketPrice] = useState<number | null>(null);
    const [prevClose, setPrevClose] = useState<number | null>(null);
    const [range, setRange] = useState<ChartRange>("1d");
    const latestPriceColor =
        typeof avgProfitNegative === "number" &&
        Number.isFinite(avgProfitNegative) &&
        typeof prevClose === "number" &&
        Number.isFinite(prevClose)
            ? avgProfitNegative > prevClose
                ? "text-green-600 dark:text-green-400"
                : avgProfitNegative < prevClose
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-900 dark:text-white"
            : "text-gray-900 dark:text-white";
    useEffect(() => {
        async function loadMarketData() {
            try {
                setLoading(true);

                const {interval, range: apiRange} = CHART_API_PARAMS[range];

                console.log("📡 Fetching:", interval, apiRange);

                const res = await fetch("/api/market-data", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
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
                        return {x: t * 1000, y: roundToTickSET(raw)};
                    })
                    .filter((p): p is { x: number; y: number } => p !== null);
                setRegularMarketPrice(data.regularMarketPrice);
                setSymbol(data.symbol);
                setSeries([{name: data.symbol, data: dataSeries}]);
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
    // const avgProfitPositive = 212142.12;
    // const profitGrowthPercent = 23.2;
    //
    // const avgProfitNegative = 30321.23;
    // const lossGrowthPercent = -12.3;
    return (
        <div>
            <PageBreadcrumb pageTitle="Line Chart"/>

            {/* ===== Section บน (Chart + Summary) ===== */}
            <div className="space-y-6">
                <ComponentCard title={`Line Chart (${symbol})`}>
                    {/* ===== Header ===== */}
                    <div className="flex flex-col gap-6 mb-6 sm:flex-row sm:items-start sm:justify-between">
                        {/* Left */}
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Statistics
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Target you’ve set for each period
                            </p>
                        </div>

                        {/* Right */}
                        <div className="flex justify-end w-full sm:w-auto">
                            <ChartTabResilient
                                value={range}
                                onChange={setRange}
                                chartParams={CHART_API_PARAMS}
                            />
                        </div>
                    </div>

                    {/* ===== Summary Numbers ===== */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
                        {/* Card 1 */}
                        <div
                            className="flex items-center justify-between p-4 border rounded-xl border-gray-200 dark:border-white/10">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    ราคาปิดก่อนหน้า
                                </p>
                                <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                    {typeof prevClose === "number" && Number.isFinite(prevClose)
                                        ? prevClose.toFixed(2)
                                        : "-"}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    บาท
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div
                            className="flex items-center justify-between p-4 border rounded-xl border-gray-200 dark:border-white/10">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    ราคาล่าสุด
                                </p>
                                <h4 className={`mt-1 text-2xl font-bold ${latestPriceColor}`}>
                                    {typeof avgProfitNegative === "number" &&
                                    Number.isFinite(avgProfitNegative)
                                        ? avgProfitNegative.toFixed(2)
                                        : "0.00"}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    บาท
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===== Chart ===== */}
                    <LineChartOne
                        series={seriesData}
                        categories={categories}
                        prevClose={prevClose}
                        loading={loading}
                        error={error}
                    />
                </ComponentCard>
            </div>

            <div className="mt-6 space-y-6">
                <ComponentCard title="Basic Table 1">
                    <BasicTableOne_main/>
                </ComponentCard>
            </div>
        </div>


    );
}
