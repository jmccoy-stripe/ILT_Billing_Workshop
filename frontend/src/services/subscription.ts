"use server";

import {
    GetCustomerActiveSubscriptionResponse,
    UpgradeSubscriptionResponse,
    DowngradeSubscriptionResponse,
} from "../interfaces/Subscription";

export async function getCustomerActiveSubscription(
    customer_id: string
): Promise<GetCustomerActiveSubscriptionResponse> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscriptions/customer/${customer_id}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { success, data } = await response.json();
    return {
        success: success,
        subscription: data,
    };
}

export async function upgradeSubscription(
    subscriptionId: string,
    newPriceId?: string
): Promise<UpgradeSubscriptionResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscriptions/upgrade-subscription`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriptionId, newPriceId }),
            }
        );

        const { subscription } = await response.json();
        if (subscription) {
            return {
                success: true,
                subscription,
            };
        }
    } catch (error) {
        console.log(error);
    }
    return {
        success: false,
        subscription: null,
    };
}

export async function downgradeSubscription(
    subscriptionId: string,
    newPriceId?: string
): Promise<DowngradeSubscriptionResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscriptions/downgrade-subscription`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriptionId, newPriceId }),
            }
        );

        const { subscription } = await response.json();
        if (subscription) {
            return {
                success: true,
                subscription,
            };
        }
    } catch (error) {
        console.log(error);
    }
    return {
        success: false,
        subscription: null,
    };
}
