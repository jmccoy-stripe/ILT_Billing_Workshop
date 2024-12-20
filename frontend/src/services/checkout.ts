"use server";

import {
    CreateCheckoutResponse,
} from "../interfaces/Subscription";

export async function createCheckout(
    customerId: string,
    priceId?: string
): Promise<CreateCheckoutResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/checkouts/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ priceId, customerId }),
            }
        );

        const { url } = await response.json();
        if (url) {
            return {
                success: true,
                url,
            };
        }
    } catch (error) {
        console.log(error);
    }
    return {
        success: false,
        url: null,
    };
}