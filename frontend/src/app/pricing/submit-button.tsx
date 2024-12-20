"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
    // ... other props ...
    priceId?: string;
    price: number;
    onClick: (priceId?: string, price?: number,) => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    onClick,
    price,
    priceId,
}) => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full flex items-center justify-center"
            onClick={() => onClick(priceId, price)}
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Loading...
                </>
            ) : (
                <>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
};
