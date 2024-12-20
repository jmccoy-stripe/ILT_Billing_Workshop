"use server";

import {
    GetProductsResponse,
} from "../interfaces/ProductResponse";

/**
 * Get all prices
 *
 * @param
 * @returns All Prices
 */
export async function getProducts(): Promise<GetProductsResponse> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
}
