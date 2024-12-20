export interface SubscriptionDetails {
    id: string;
    planName: string;
    price: number;
    currency: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
};

export interface GetCustomerActiveSubscriptionResponse {
    success: boolean;
    subscription: SubscriptionDetails | null;
}

export interface CreateCheckoutResponse {
    success: boolean;
    url: string | null;
}

export interface UpgradeSubscriptionResponse {
    success: boolean;
    subscription: SubscriptionDetails | null;
}

export interface DowngradeSubscriptionResponse {
    success: boolean;
    subscription: SubscriptionDetails | null;
}