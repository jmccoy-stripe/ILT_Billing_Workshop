import { Request, Response } from "express";
import { stripe } from "../stripe";
import Stripe from "stripe";

export const getSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Retrieve active subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: id,
            status: "all", // Retrieve all statuses (active, trialing, etc.)
        });

        if (subscriptions.data.length === 0) {
            res.status(404).json({ success: false, error: "No active subscription found" });
            return;
        }

        const subscription = subscriptions.data[0];
        const plan = subscription.items.data[0].plan;
        const product = await stripe.products.retrieve(
            plan.product?.toString()!
        );
        // Extract relevant details
        const planDetails = {
            id: subscription.id,
            planName: (product as Stripe.Product).name,
            price: (plan.amount ?? 0) / 100, // Convert cents to dollars
            currency: plan.currency,
            currentPeriodStart: new Date(
                subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
        };

        res.json({
            success: true,
            data: planDetails,
        });
    } catch (error) {
        console.error("Error fetching subscription details:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

/**
 * Upgrades a customer's subscription to a higher plan.
 * 
 * This method processes the upgrade request and applies proration for the change.
 * Proration means that the customer will be charged for the difference between the
 * current plan and the new plan based on the time remaining in the current billing cycle.
 * 
 * This method uses `proration_behavior: 'create_prorations'`, meaning that Stripe will
 * automatically calculate the prorated amount for the upgrade based on the time left in the
 * current billing cycle.
 * 
 */
export const upgradeSubscription = async (req: Request, res: Response) => {
    try {
        const { subscriptionId, newPriceId } = req.body;

        // Fetch the current subscription
        const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
        );

        // Update the subscription with the new plan
        const updatedSubscription = await stripe.subscriptions.update(
            subscriptionId,
            {
                items: [
                    {
                        id: subscription.items.data[0].id, // Current subscription item ID
                        price: newPriceId, // ID of the new price/plan
                    },
                ],
                proration_behavior: "create_prorations", // Charge the user for the difference
            }
        );

        res.status(200).json({ subscription: updatedSubscription });
    } catch (error) {
        console.error("Error upgrading subscription:", error);
        res.status(500).json({ error});
    }
};

/**
 * Downgrades a customer's subscription to a lower plan.
 * 
 * This method processes the downgrade request and does not apply proration for the change.
 * Proration is skipped in this case, meaning the customer will not be charged or credited
 * for the difference between the current plan and the new, lower plan.
 * 
 * This method uses `proration_behavior: 'none'`, which means no proration will occur, and the customer
 * will not be billed for the difference between the plans immediately. Instead, they will be charged
 * the full price of the new, lower plan at the start of the next billing cycle.
 * 
 */
export const downgradeSubscription = async (req: Request, res: Response) => {
    try {
        const { subscriptionId, newPriceId } = req.body;

        // Fetch the current subscription
        const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
        );

        // Update the subscription with the new plan
        const updatedSubscription = await stripe.subscriptions.update(
            subscriptionId,
            {
                items: [
                    {
                        id: subscription.items.data[0].id, // Current subscription item ID
                        price: newPriceId, // ID of the new price/plan
                    },
                ],
                proration_behavior: "none", // Charge the user for the difference
            }
        );

        res.status(200).json({ subscription: updatedSubscription });
    } catch (error) {
        console.error("Error upgrading subscription:", error);
        res.status(500).json({ error});
    }
};
