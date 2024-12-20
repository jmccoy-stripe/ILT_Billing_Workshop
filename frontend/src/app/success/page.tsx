import { FC } from "react";
import Image from "next/image";

const Success: FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-xl mx-auto p-6 text-center">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <Image
                        src="/payment-success.png" // Make sure to have a corresponding image in the public folder
                        alt="Success"
                        width={1200}
                        height={600}
                        className="w-[50%] h-64 m-auto"
                    />
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-green-500 mb-4">
                            Subscription Successful!
                        </h1>
                        <p className="text-gray-700 mb-6">
                            Thank you for subscribing. Your subscription was
                            processed successfully. You can now access all
                            premium features.
                        </p>
                        <a className="cursor-pointer inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600" href="/dashboard">
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;
