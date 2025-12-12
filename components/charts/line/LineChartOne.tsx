"use client";
import React, {useEffect, useState} from "react";
import { roundToTickSET, isValidPrice } from "@/lib/utils";
import {ApexOptions} from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function LineChartOne() {
    const [seriesData, setSeries] = useState<ApexAxisChartSeries>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        async function loadMarketData() {
            try {
                console.error("open loadMarketData");
                const res = await fetch("/api/market-data", {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify({name: "BTS", country: "BK", interval: "1d", range: "6mo",}),
                });
                if (!res.ok) {
                    console.error("❌ Failed to load market data");
                    throw new Error("Failed to load market data");
                }
                const data = await res.json();
                if (!data?.graph?.close || !data?.graph?.timestamp) {
                    console.error("❌ Invalid API response", data);
                    return;
                }

                const dataSeries = data.graph.timestamp
                    .map((t: number, i: number) => {
                        const raw = data.graph.close[i];

                        if (!isValidPrice(raw)) return null;

                        return {
                            x: t * 1000,
                            y: roundToTickSET(raw),
                        };
                    })
                    .filter(
                        (p: null): p is { x: number; y: number } => p !== null
                    );

                // ✅ ใช้ response จาก route.ts ตรง ๆ
                setSeries([{
                    name: data.symbol,
                    data: dataSeries,
                },]);
                // setCategories(data.graph.timestamps.map((t: number) => new Date(t * 1000).toLocaleDateString("th-TH")));
                setCategories(data.graph.timestamp.map((t: number) => new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }).format(new Date(t * 1000))));
            } catch (err: unknown) {
                const error = err as Error;
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadMarketData();
    }, []);

    const options: ApexOptions = {
        legend: {
            show: false, // Hide legend
            position: "top",
            horizontalAlign: "left",
        },
        colors: ["#465FFF", "#9CB9FF"], // Define line colors
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line", // Set the chart type to 'line'
            toolbar: {
                show: false, // Hide chart toolbar
            },
        },
        stroke: {
            curve: "straight", // Define the line style (straight, smooth, or step)
            width: [2, 2], // Line width for each dataset
        },

        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0, // Size of the marker points
            strokeColors: "#fff", // Marker border color
            strokeWidth: 2,
            hover: {
                size: 6, // Marker size on hover
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false, // Hide grid lines on x-axis
                },
            },
            yaxis: {
                lines: {
                    show: true, // Show grid lines on y-axis
                },
            },
        },
        dataLabels: {
            enabled: false, // Disable data labels
        },
        tooltip: {
            enabled: true, // Enable tooltip
            x: {
                format: "dd MMM yyyy", // Format for x-axis tooltip
            },
        },
        xaxis: {
            type: "datetime", // Category-based x-axis
            categories: categories,
            axisBorder: {
                show: false, // Hide x-axis border
            },
            axisTicks: {
                show: false, // Hide x-axis ticks
            },
            tooltip: {
                enabled: false, // Disable tooltip for x-axis points
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px", // Adjust font size for y-axis labels
                    colors: ["#6B7280"], // Color of the labels
                },
            },
            title: {
                text: "", // Remove y-axis title
                style: {
                    fontSize: "0px",
                },
            },
        },
    };
    const series =seriesData;
    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div id="chartEight" className="min-w-[1000px]">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={310}
                />
            </div>
        </div>
    );
}
