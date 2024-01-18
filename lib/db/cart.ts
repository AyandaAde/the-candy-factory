import { cookies } from "next/dist/client/components/headers";
import { db } from ".";
import { cart, CartType, cartItems} from "./schema";
import { desc, eq} from "drizzle-orm";
import type { BuildQueryResult, ExtractTablesWithRelations } from 'drizzle-orm';
import * as schema from './schema';
import { auth } from "@clerk/nextjs";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;


export type InferResultType<
  TableName extends keyof TSchema,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: {
        items: {
            with: {
                product: true,
            }
        },
    };
  }
>;

export type InferResultType2<
  TableName extends keyof TSchema,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: {
        product: true,
    },
  }
>;

export type CartWithProducts = InferResultType<'cart'>;

export type CartItemWithProduct = InferResultType2<"cartItems">;

export type ShoppingCart = CartWithProducts & {
    size: number,
    subtotal: number,
};
export async function getCart(): Promise<ShoppingCart | null>{
    const {userId} = await auth();
    const isAuth = !!userId;
    let carts: CartWithProducts | null = null;
    
    if(isAuth){
        await db.insert(cart).values({
            userId,
        });
        carts = await db.query.cart.findFirst({
            where: eq(cart.userId, userId),
            with: {
                items: {
                    with: {
                        product: true,
                    }
                }
            }
        })
    } else {
        const localCartId = cookies().get("localCartId")?.value;
    carts = localCartId ?
    (await db.query.cart.findFirst({ 
        where: eq(cart.id, parseInt(localCartId)), 
          with: {
            items: {
                with: {
                    product: true,
                }
            }
        }}
    ))
    : null;
    }

    

    if(!carts){
        return null;
    };
    return {
        ...carts,
        size: carts.items.reduce((acc, item) => acc + item.quantity!, 0),
        subtotal: carts.items.reduce((acc, item) => acc + item.quantity! * item.product.price!, 0),
    }

    
}
export async function createCart(): Promise<ShoppingCart>{
    const {userId} = await auth();
    const isAuth = !!userId;
    
    let newCart = await db.select().from(cart);
    
    if(isAuth){
        await db.insert(cart).values({
            userId,
        });
        newCart = await db.select().from(cart).orderBy(desc(cart.id));
    } else {
        await db.insert(cart).values({});
        newCart = await db.select().from(cart).orderBy(desc(cart.id));
        cookies().set("localCartId", newCart[0].id.toString());
    }

    return{
        ...newCart[0],
        items: [],
        size: 0,
        subtotal: 0,
    }

}

export async function mergeAnonymousCartIntoUserCart(userId: string){
    const localCartId = cookies().get("localCartId")?.value;

    const localCart = localCartId ?
    (await db.query.cart.findFirst({ 
        where: eq(cart.id, parseInt(localCartId)), 
          with: {
            items: true,
        }}
    )) : null;

    if(!localCart) return;

    const userCart = await db.query.cart.findFirst({
        where: eq(cart.userId, userId),
        with: {
            items: true,
        },
    })

    await db.transaction(async (tx) => {
        if (userCart){
            const mergedCartItems = mergeCartItems(localCart.items, userCart.items);
            await tx.delete(schema.cartItems).where(eq(schema.cartItems.cartId, userCart.id));
            await tx.insert(schema.cartItems).values(
                mergedCartItems.map((item) => ({
                    cartId: userCart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                }))
            )
        } else{
            await tx.insert(cart).values({
                userId,
            });
            await tx.insert(cartItems).values(
                localCart.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            )
        }
        await tx.delete(cart).where(eq(cart.id, localCart.id));

        cookies().set("localCartId", "");
    })
}

function mergeCartItems(...cartItems: schema.CartItemType[][]){
    return cartItems.reduce((acc, items) => {
        items.forEach((item) => {
            const existingItem = acc.find((i) => i.productId === item.productId);
            if (existingItem){
                existingItem.quantity! += item.quantity!;
            } else {
                acc.push(item);
            };
        });
        return acc;
    },[] as schema.CartItemType[]);
 }