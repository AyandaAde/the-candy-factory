"use client";

import React, { useState, useTransition } from 'react'
import { Button } from './ui/button';
import { ShoppingCartIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
type Props = {
    productId: number,
    incrementProductQuantity: (productId: number) => Promise<void>
}

const AddToCartButton = ({ productId, incrementProductQuantity }: Props) => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    return (
        <div>
            <Button
                onClick={() => {
                    setSuccess(false);
                    startTransition(async () => {
                        await incrementProductQuantity(productId);
                        setSuccess(true);
                        toast.success("Product successfully added to cart.")
                    })
                }}
            >
                {isPending && <span className="loading loading-spinner loading-md mr-[5px]" />}
                Add to Cart
                <ShoppingCartIcon className="ml-[5px]" />
            </Button>

            <Toaster richColors />
        </div>
    )
}

export default AddToCartButton