// lib/constants.ts
export const CHART_API_PARAMS = {
    "1d":  {   interval: "5m",  range: "1d"  },
    "5d":  {   interval: "15m", range: "5d"  },
    "1m":  {   interval: "1d",  range: "1mo" },
    "3m":  {   interval: "1d",  range: "3mo" },
    "6m":  {   interval: "1d",  range: "6mo" },
    "1y":  {   interval: "1d",  range: "1y"  },
    "5y":  {  interval: "1wk", range: "5y"  },
    "Max": {  interval: "1mo", range: "max" },
} as const;

export type ChartRange = keyof typeof CHART_API_PARAMS;
export type ChartApiParams = typeof CHART_API_PARAMS;

