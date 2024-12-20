export type SessionPayload =  {
    id: string;
    email: string;
}

export type Customer = {
    stripe_customer_id: string; // Unique identifier (e.g., UUID)
    name: string;
    email: string;
};

export type Subscription = {
    stripe_subscription_id: string;
    stripe_customer_id: string;
    plan_price: number;
    subscription_status: string;
    current_period_start: Date;
    current_period_end: Date;
};
