"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { removeToken } from "@/services/auth";
import { getCustomer } from "@/services/customer";
import { Customer } from "@/interfaces/Customer";
import { GetCustomerResponse } from "@/interfaces/CustomerResponse";

const Header = () => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCustomer = async () => {
            const customer_email = localStorage.getItem("customer_email");
            if (customer_email) {
                const response: GetCustomerResponse = await getCustomer(
                    customer_email
                );
                setCustomer(response.customer);
            }
        };

        fetchCustomer();
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem("customer_id");
        localStorage.removeItem("customer_email");
        await removeToken();
        router.push("/signin"); // Redirect to sign-in page
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md bg-white">
            {/* Logo */}
            <div className="flex items-center space-x-4">
                <Image
                    src="/logo.jpg"
                    alt="Logo"
                    className="h-10"
                    width={80}
                    height={80}
                />
                <span className="text-xl font-bold">ILT Workshop</span>
            </div>

            {/* User Info */}

            {/* Logout Button */}
            <div className="flex gap-4 items-center">
                <div className="flex items-center justify-end gap-4 items-center">
                    <span className="text-[24px] tracking-wider mr-8">
                        @{customer?.name}
                    </span>
                    {/* <span className="text-sm text-gray-600">{customer.email}</span> */}
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
