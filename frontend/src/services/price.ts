"use server";

import {
    GetPricesResponse,
} from "../interfaces/PriceResponse";

/**
 * Get all prices
 *
 * @param
 * @returns All Prices
 */
export async function getPrices(): Promise<GetPricesResponse> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/prices`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
}
