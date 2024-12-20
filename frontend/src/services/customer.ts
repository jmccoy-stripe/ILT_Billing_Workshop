"use server";

import {
    CreateCustomerResponse,
    GetCustomerResponse,
} from "../interfaces/CustomerResponse";

/**
 * Creates a new customer
 *
 * @param email The email of the customer.
 * @param username The username of the customer.
 * @returns a boolean indicating if the customer was created successfully.
 */
export async function createCustomer(
    email: string,
    name: string
): Promise<CreateCustomerResponse> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    return data;
}

/**
 * Get customer
 *
 * @param email The email of the user.
 * @returns a boolean indicating if the user was created successfully.
 */
export async function getCustomer(email: string): Promise<GetCustomerResponse> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${email}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data;
}
