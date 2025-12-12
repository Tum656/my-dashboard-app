export function roundToTickSET(price: number): number {
    let tick = 0.01;

    if (price >= 2 && price < 5) tick = 0.02;
    else if (price < 10) tick = 0.05;
    else if (price < 25) tick = 0.1;
    else tick = 0.25;

    const factor = 1 / tick;
    return Math.round(price * factor) / factor;
}

export function isValidPrice(price: number | null | undefined): price is number {
    return price !== null && price !== undefined && price > 0;
}