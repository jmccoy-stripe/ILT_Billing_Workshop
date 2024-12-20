import { Request, Response } from 'express';
import dotenv from 'dotenv';

import { getCustomerById } from '../db';
import { stripe } from '../stripe';

dotenv.config();
export const createCheckoutSession = async (req: Request, res: Response) => {
    const { priceId, customerId } = req.body; // Should be passed from the frontend

    try {
        // Retrieve the user's data from the database
        const customer = await getCustomerById(customerId.toString());
        if (!customer) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: customer.stripe_customer_id,
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });
        res.json({ success: true, sessionId: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error });
    }
};