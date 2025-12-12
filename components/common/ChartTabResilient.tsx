import React from "react";
import {ChartApiParams, ChartRange} from "@/lib/constants";

const entries = <T extends Record<string, any>>(obj: T) =>
    Object.entries(obj) as [keyof T, T[keyof T]][];

type ChartTabResilientProps = {
    value: ChartRange;
    onChange: (value: ChartRange) => void;
    chartParams: ChartApiParams;
};

const ChartTabResilient = ({
                               value,
                               onChange,
                               chartParams,
                           }: ChartTabResilientProps) => {
    const getButtonClass = (option: ChartRange) =>
        value === option
            ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            : "text-gray-500 dark:text-gray-400";

    const tabs = entries(chartParams).map(([key]) => ({
        value: key as ChartRange,
        label: key,
    }));

    return (
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            {tabs.map((tab) => (
                <button
                    key={tab.value}

                    onClick={() => {
                        console.log("Data value:", tab.value);
                        onChange(tab.value);
                    }}
                    className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                        tab.value
                    )}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default ChartTabResilient;
