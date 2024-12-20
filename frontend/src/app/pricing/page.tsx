"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import {
    getCustomerActiveSubscription,
    upgradeSubscription,
    downgradeSubscription,
} from "@/services/subscription";
import { createCheckout } from "@/services/checkout";
import { getPrices } from "@/services/price";
import { getProducts } from "@/services/product";
import { SubscriptionDetails } from "@/interfaces/Subscription";
import { Price } from "@/interfaces/Price";
import { Product } from "@/interfaces/Product";
import { SubmitButton } from "./submit-button";

export default function Pricing() {
    const [subscriptionDetails, setSubscriptionDetails] =
        useState<SubscriptionDetails | null>(null);
    const [, setProducts] = useState<Product[]>([]);
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsAndPrices = async () => {
            try {
                // Fetch products
                const productsRes = await getProducts();
                setProducts(productsRes.products);

                // Fetch prices
                const pricesRes = await getPrices();
                setPrices(pricesRes.prices);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndPrices();
    }, []);

    const fetchSubscriptionDetails = async (customer_id: string) => {
        const response = await getCustomerActiveSubscription(customer_id);
        if (response.success) setSubscriptionDetails(response.subscription);
    };

    useEffect(() => {
        const stripeCustomerId = localStorage.getItem("customer_id");
        if (!stripeCustomerId) {
            console.error("No Stripe Customer ID found in localStorage");
            return;
        }
        fetchSubscriptionDetails(stripeCustomerId);
    }, []);

    const onClick = async (priceId?: string, price?: number) => {
        const stripeCustomerId = window.localStorage.getItem("customer_id");
        try {
            if (stripeCustomerId) {
                if (
                    subscriptionDetails === null ||
                    subscriptionDetails === undefined
                ) {
                    const response = await createCheckout(
                        stripeCustomerId,
                        priceId
                    );
                    if (response.success && response.url) {
                        window.location.href = response.url;
                    }
                } else if ((price ?? 0) > subscriptionDetails.price * 100.0) {
                    const response = await upgradeSubscription(
                        subscriptionDetails.id,
                        priceId
                    );
                    if (response.success) {
                        fetchSubscriptionDetails(stripeCustomerId);
                        toast.success("Upgraded subscription successfully!");
                    }
                } else {
                    const response = await downgradeSubscription(
                        subscriptionDetails.id,
                        priceId
                    );
                    if (response.success) {
                        fetchSubscriptionDetails(stripeCustomerId);
                        toast.success("Downgraded subscription successfully!");
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const PricingCard = ({
        name,
        price,
        interval,
        trialDays,
        features,
        priceId,
        isActive = false,
    }: {
        name: string;
        price: number;
        interval: string;
        trialDays: number;
        features: string[];
        priceId?: string;
        isActive?: boolean;
    }) => {
        return (
            <div className="p-6 border-2 border-gray-300 rounded-lg">
                <div className="flex align-center">
                    <span className="text-2xl font-medium text-gray-900 mb-2">
                        {name}
                    </span>
                    {isActive && (
                        <Image
                            src="/check.png" // Make sure to have a corresponding image in the public folder
                            alt="Success"
                            width={80}
                            height={80}
                            className="w-[30px] inline-block mb-2 ml-2"
                        />
                    )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    with {trialDays} day free trial
                </p>
                <p className="text-4xl font-medium text-gray-900 mb-6">
                    ${price / 100}{" "}
                    <span className="text-xl font-normal text-gray-600">
                        per user / {interval}
                    </span>
                </p>
                <ul className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
                <SubmitButton
                    priceId={priceId}
                    price={price}
                    onClick={onClick}
                />
            </div>
        );
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p style={{ textAlign: "center", fontSize: 32, marginBottom: 60 }}>
                Pricing Plans
            </p>
            <div className="grid md:grid-cols-3 gap-16 max-w-4xl mx-auto">
                {prices.map(
                    (price) =>
                        price.product.active && (
                            <PricingCard
                                key={price.id}
                                name={price.product.name}
                                price={price.unit_amount}
                                interval={"month"}
                                trialDays={7}
                                features={[
                                    "Unlimited Usage",
                                    "Unlimited Workspace Members",
                                    "Email Support",
                                ]}
                                priceId={price?.id}
                                isActive={
                                    price?.product.name ===
                                    subscriptionDetails?.planName
                                }
                            />
                        )
                    // <li key={price.id}>
                    //     <h2>{price.product.name}</h2>
                    //     <p>{price.product.description}</p>
                    //     <p>
                    //         Price: {(price.unit_amount / 100).toFixed(2)}{" "}
                    //         {price.currency.toUpperCase()}
                    //     </p>
                    // </li>
                )}
            </div>
        </main>
    );
}
