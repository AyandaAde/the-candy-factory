"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { createCart, getCart } from "./db/cart";
import { cartItems } from "./db/schema";
import { revalidatePath } from "next/cache";
import * as schema from "./db/schema";

export async function incrementProductQuantity(productId: number){
    const cart = await getCart() ?? await createCart();

    const articleInCart = cart.items.find(item => item.productId === productId) 

    if(articleInCart){
        await db.update(cartItems).set({
            quantity: sql`${cartItems.quantity} + 1`,
        }).where(eq(cartItems.id, articleInCart.id));
    } else {
        await db.insert(cartItems).values({
            cartId: cart.id,
            productId,
            quantity: 1,
        });
    };

    revalidatePath("/prducts/[id]", 'page');
};

export async function setProductQuantity(productId: number, quantity: number){
    const cart = await getCart() ?? await createCart();
    const articleInCart = cart.items.find(item => item.productId === productId) 

    if(quantity === 0){
        if(articleInCart){
            await db.delete(cartItems).where(eq(cartItems.id, articleInCart.id));
        }
    }else {
        if (articleInCart){
            await db.update(cartItems).set({quantity,}).where(eq(cartItems.id, articleInCart.id));
        } else {
            await db.insert(cartItems).values({
                cartId: cart.id,
                productId,
                quantity,
            });
    } 
    }
    revalidatePath("/cart");
}