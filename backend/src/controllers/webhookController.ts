import { Request, Response } from "express";
import { addSubscription } from "../db";
import dotenv from "dotenv";
import { stripe } from "../stripe";
dotenv.config();
export const handleCheckoutWebhook = async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET ?? "" // Webhook secret from Stripe dashboard
    );
    

    switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
            const subscription = event.data.object;

            // Extract subscription details
            const stripeSubscriptionId = subscription.id;
            const stripeCustomerId = subscription.customer as string;
            const planPrice = subscription.items.data[0].price.unit_amount ?? 0; // Price in cents
            const subscriptionStatus = subscription.status;
            const currentPeriodStart = new Date(
                subscription.current_period_start * 1000
            ); // Convert UNIX timestamp
            const currentPeriodEnd = new Date(
                subscription.current_period_end * 1000
            ); // Convert UNIX timestamp

            // Insert into db
            try {
                await addSubscription(stripeSubscriptionId, stripeCustomerId, planPrice, subscriptionStatus, currentPeriodStart, currentPeriodEnd);
            } catch (error) {
                console.error(
                    "Error inserting subscription into database:",
                    error
                );
                res.status(500).send("Database Error");
                return;
            }
        }
    }

    res.status(200).send("Webhook received.");
};
