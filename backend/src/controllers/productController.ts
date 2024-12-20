import { Request, Response } from "express";
import { stripe } from "../stripe";

export const getProducts = async (req: Request, res: Response) => {
    try {
        // Fetch all products from Stripe
        const products = await stripe.products.list();
        res.status(200).json({ success: true, products: products.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
};
