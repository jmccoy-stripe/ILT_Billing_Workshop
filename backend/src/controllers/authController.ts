import { Request, Response } from "express";
import { getCustomerById } from "../db";
import { stripe } from "../stripe";
import { encrypt } from "../utils/auth";

export const generateToken = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        const customer = await getCustomerById(id);
        if (!customer) {
            res.status(404).json({ success: false, error: "No User" });
            return;
        }
        const jwtPayload = {
            id: customer.stripe_customer_id,
            email: customer.email,
        };

        const jwt = await encrypt(jwtPayload);
        // Authentication successful

        res.status(200).json({ success: true, token: jwt });
        return;
    } catch (error) {
        res.status(500).json({ success: false, error: error });
        return;
    }
};
