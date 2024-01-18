import AddToCartButton from "@/components/AddToCartButton"
import PriceTag from "@/components/PriceTag"
import { incrementProductQuantity } from "@/lib/actions"
import { db } from "@/lib/db"
import { product } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"

type Props = {
    params: {
        id: string,
    }

}

const getProduct = cache(async (id: string) => {
    const products = await db.select().from(product).where(eq(product.id, parseInt(id)));
    if (!products) notFound();
    return products;
})
export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
    const products = await getProduct(id);

    return {
        title: products[0].name + " - Gummy King",
        description: products[0].description,
        openGraph: {
            images: [{ url: products[0].imageUrl! }],
        },
    }


}

const ProductPage = async ({ params: { id } }: Props) => {
    const products = await getProduct(id);

    return (
        <>
            <div className="card lg:card-side bg-base-200 dark:bg-black shadow">
                <Image
                    width={500}
                    height={500}
                    src={products[0].imageUrl!}
                    alt={products[0].name!}
                    className="rounded-lg hover:scale-110 transition duration-500"
                    priority
                />
                <div className="card-body">
                    <h1 className="text-5xl font-bold">{products[0].name}</h1>
                    <PriceTag price={products[0].price!} className="mt-4" />
                    <p className="py-6">{products[0].description}</p>
                    <AddToCartButton
                        productId={products[0].id}
                        incrementProductQuantity={incrementProductQuantity}
                    />
                </div>
            </div>
        </>
    )
}

export default ProductPage