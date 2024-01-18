"use client";

import { ShoppingCart } from "@/lib/db/cart";
import { Label } from "./ui/label";
import { ShoppingCartIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
    cart: ShoppingCart | null;
}

const ShoppingCartButton = ({ cart }: Props) => {

    function closeDropdown() {
        const elem = document.activeElement as HTMLElement
        if (elem) {
            elem.blur();
        }
    }
    return (
        <div className="dropdown dropdown-end mr-[5px]">
            <Label tabIndex={0} className="btn-ghost btn-circle btn">
                <div className="indicator">
                    <ShoppingCartIcon />
                    <span className="badge badge-sm indicator-item">
                        {cart?.size || 0}
                    </span>
                </div>
            </Label>
            <div
                tabIndex={0}
                className="card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow z-30"
            >
                <div className="card-body">
                    <span className="text-lg font-semibold dark:text-black">{cart?.size || 0} Items</span>
                    <span className="text-info">
                        Subtotal: {formatPrice(cart?.subtotal || 0)}
                    </span>
                    <div className="card-actions">
                        <Button
                            className="w-full"

                        >
                            <Link
                                href="/cart"
                                onClick={closeDropdown}
                            >
                                View cart
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCartButton