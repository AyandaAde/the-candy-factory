import CartEntry from "@/components/CartEntry";
import { Button } from "@/components/ui/button";
import { setProductQuantity } from "@/lib/actions";
import { getCart } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";

type Props = {}

export const metadata = {
    title: "Your Cart - The Candy Factory",
};

const CartPage = async (props: Props) => {
    const cart = await getCart();

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
            {cart?.items.map((cartItem) => (
                <CartEntry cartItem={cartItem} key={cartItem.id} setProductQuantity={setProductQuantity} />
            ))}
            {!cart?.items.length && <p>Your cart is empty.</p>}
            <div className="flex flex-col items-end sm:items-center">
                <p className="mb-3 font-bold">
                    Total: {formatPrice(cart?.subtotal || 0)}
                </p>
                <Button className="sm:w-[200px]">Checkout</Button>
            </div>
        </div>
    )
}

export default CartPage