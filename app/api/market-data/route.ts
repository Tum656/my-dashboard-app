import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {

        const body = await req.json();
        const {name, country, interval, range} = body;
        if (!name || !country) {
            return NextResponse.json(
                {error: "Missing required parameters"},
                {status: 400}
            );
        }

        const symbol = `${name}.${country}`;
        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0", // Yahoo ต้องการ
            },
            cache: "no-store", // ไม่ cache ราคาหุ้น
        });

        if (!response.ok) {
            throw new Error("Failed to fetch market data");
        }

        const data = await response.json();


        const chart = data?.chart?.result?.[0];

        if (!chart) {
            return NextResponse.json(
                {error: "No market data found"},
                {status: 404}
            );
        }
        const graph = data.chart.result[0].indicators.quote[0];
        const regularMarketPrice = data.chart.result[0].meta.regularMarketPrice;
        const timestamp_series = data.chart.result[0].timestamp;
        graph.timestamp = timestamp_series;
        const previousClose=data.chart.result[0].meta.previousClose;

        return NextResponse.json({
            symbol,
            previousClose,
            interval,
            range,
            regularMarketPrice,
            graph,
        });
    } catch (err: unknown) {
        const error = err as Error;
        return NextResponse.json(
            {error: error.message ?? "Internal Server Error"},
            {status: 500}
        );
    }
}
