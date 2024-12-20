"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionDetails } from "@/interfaces/Subscription";
import { getCustomerActiveSubscription } from "@/services/subscription";

const Dashboard = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionDetails, setSubscriptionDetails] =
        useState<SubscriptionDetails | null>(null);

    useEffect(() => {
        const fetchSubscriptionDetails = async (customer_id: string) => {
            const response = await getCustomerActiveSubscription(customer_id);
            if (response.success) setSubscriptionDetails(response.subscription);
            setIsLoading(false);
        };
        const stripeCustomerId = localStorage.getItem("customer_id");
        if (!stripeCustomerId) {
            console.error("No Stripe Customer ID found in localStorage");
            return;
        }

        fetchSubscriptionDetails(stripeCustomerId);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Dashboard
                </h1>
                <div className="border-t-2 border-gray-200 pt-4">
                    <h2 className="text-lg font-bold text-gray-700 mb-2">
                        Plan Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {subscriptionDetails !== null ? (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Plan Name
                                    </p>
                                    <p className="font-medium">
                                        {subscriptionDetails.planName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Price
                                    </p>
                                    <p className="font-medium">
                                        {subscriptionDetails?.price}{" "}
                                        {subscriptionDetails?.currency?.toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Status
                                    </p>
                                    <p className="font-medium capitalize">
                                        {subscriptionDetails.status}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Current Period Start
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            subscriptionDetails.currentPeriodStart
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Current Period End
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            subscriptionDetails.currentPeriodEnd
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div>No Active Plan</div>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
                        onClick={() => {
                            router.push("/pricing");
                        }}
                    >
                        Manage Subscription
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
