"use client";
import React, {useMemo} from "react";
import {ApexOptions} from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {ssr: false});

type Props = {
    series: ApexAxisChartSeries;
    categories: string[];
    prevClose: number | null;
    loading: boolean;
    error: string | null;
};

function extractY(val: any): number | null {
    // รองรับ [x,y] และ {x,y}
    if (Array.isArray(val)) {
        const y = val[1];
        return typeof y === "number" && Number.isFinite(y) ? y : null;
    }
    if (val && typeof val === "object") {
        const y = (val as any).y;
        return typeof y === "number" && Number.isFinite(y) ? y : null;
    }
    return null;
}

export default function LineChartOne({
                                         series,
                                         categories,
                                         prevClose,
                                         loading,
                                         error,
                                     }: Props) {
    const prev = typeof prevClose === "number" && Number.isFinite(prevClose) ? prevClose : null;

    const {yMin, yMax} = useMemo(() => {
        const ys: number[] = [];

        (series ?? []).forEach((s: any) => {
            (s?.data ?? []).forEach((p: any) => {
                const y = extractY(p);
                if (y !== null) ys.push(y);
            });
        });

        if (prev !== null) ys.push(prev);

        if (ys.length === 0) return {yMin: undefined as number | undefined, yMax: undefined as number | undefined};

        const min = Math.min(...ys);
        const max = Math.max(...ys);

        // padding กันเส้นชนขอบ (ใช้ % ของช่วง ถ้าช่วงเป็น 0 ให้ใช้ค่าคงที่)
        const range = max - min;
        const pad = range > 0 ? range * 0.08 : 0.02;

        return {
            yMin: min - pad,
            yMax: max + pad,
        };
    }, [series, prev]);

    const options: ApexOptions = {
        legend: {show: false},
        colors: ["#465FFF", "#9CB9FF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line",
            toolbar: {show: false},
        },
        stroke: {curve: "straight", width: [2, 2]},

        annotations: prev
            ? {
                yaxis: [
                    {
                        y: prev,
                        borderColor: "#FF4560",
                        strokeDashArray: 4,
                        label: {
                            text: `Prev Close: ${prev.toFixed(2)}`,
                            style: {
                                color: "#fff",
                                background: "#FF4560",
                                fontSize: "12px",
                            },
                        },
                    },
                ],
            }
            : undefined,

        xaxis: {
            type: "datetime",
            labels: {datetimeUTC: false},
        },

        yaxis: {
            min: yMin,
            max: yMax,
            labels: {
                style: {
                    fontSize: "12px",
                    colors: ["#6B7280"],
                },
            },
        },
    };

    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div id="chartEight" className="min-w-[1000px]">
                <ReactApexChart options={options} series={series} type="area" height={310}/>
            </div>
        </div>
    );
}
