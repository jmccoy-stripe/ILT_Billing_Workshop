import { Request, Response } from "express";
import { stripe } from "../stripe";

export const getPrices = async (req: Request, res: Response) => {
    try {
        // Fetch all prices from Stripe
        const prices = await stripe.prices.list({
            expand: ["data.product"], // Expands product information associated with each price
        });
        const sortedPrices = prices.data.sort(
            (a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0)
        );
        res.status(200).json({ success: true, prices: sortedPrices });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};
