"use server";

import { cookies } from "next/headers";
/**
 * Validates the customer's credentials.
 *
 * @param id The id of the customer.
 */

export async function generateToken(id: string) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/generate-token`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success == true) {
                (await cookies()).set("jwt", data.token, { httpOnly: true });
                return {
                    success: true,
                };
            } else {
                return {
                    success: false,
                };
            }
        }
    } catch (error: unknown) {
        console.error(error);
    }
    return {
        success: false,
        id: null,
    };
}

export async function removeToken() {
    (await cookies()).set("jwt", "", { httpOnly: true, expires: new Date(0) });
}
