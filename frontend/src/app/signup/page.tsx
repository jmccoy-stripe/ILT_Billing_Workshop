"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleIcon } from "lucide-react";

import { generateToken } from "@/services/auth";
import { createCustomer, getCustomer } from "@/services/customer";
import {
    CreateCustomerResponse,
    GetCustomerResponse,
} from "@/interfaces/CustomerResponse";

const SignUp = () => {
    const mode: string = "signup";
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Use FormData to access input values
        const formData = new FormData(event.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;

        const response: GetCustomerResponse = await getCustomer(email);
        if(response.success) {
            toast.error("This email duplicates! Try again.");
            return;
        }

        const userCreated: CreateCustomerResponse = await createCustomer(
            email,
            name
        );
        if (userCreated.success) {
            const tokenResponse = await generateToken(
                userCreated.stripeCustomerId
            );
            if (tokenResponse.success) {
                toast.success("Sign up successfully!");
                localStorage.setItem(
                    "customer_id",
                    userCreated.stripeCustomerId
                );
                localStorage.setItem("customer_email", email);
                router.push("/dashboard");
            }
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <CircleIcon className="h-12 w-12 text-orange-500" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {mode === "signin"
                        ? "Sign in to your account"
                        : "Create your account"}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <Label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </Label>
                        <div className="mt-1">
                            <Input
                                id="name"
                                name="name"
                                type="name"
                                autoComplete="name"
                                required
                                maxLength={50}
                                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </Label>
                        <div className="mt-1">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                maxLength={50}
                                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Sign Up
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                                {mode === "signin"
                                    ? "New to our platform?"
                                    : "Already have an account?"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href="/signin"
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Sign in to existing account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
