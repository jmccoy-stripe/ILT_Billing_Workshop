import { Request, Response } from "express";
import { addCustomer, getCustomerByEmail } from "../db";
import { stripe } from "../stripe";

export const getCustomer = async (req: Request, res: Response) => {
    const { email } = req.params;

    try {
        // Query the database for the stripe_customer_id
        const customer = await getCustomerByEmail(email);
        if (!customer) {
            res.status(404).json({ success: false, customer: null });
            return;
        }

        res.status(200).json({ success: true, customer: customer });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch customer details" });
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;

        const customer = await stripe.customers.create({
            email,
            name,
        });

        await addCustomer(customer.id, name, email);

        res.status(200).json({
            success: true,
            stripeCustomerId: customer.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
    }
};
