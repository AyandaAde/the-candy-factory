import ProductCard from "@/components/ProductCard"
import { db } from "@/lib/db"
import { product } from "@/lib/db/schema"
import { desc, eq, ilike, or } from "drizzle-orm"
import { Metadata } from "next"

type Props = {
    searchParams: { query: string },
}

export function generateMetadata({
    searchParams: { query },
}: Props): Metadata {
    return {
        title: `Search: ${query} - The Candy Factory`,
    };
}

const SearchPage = async ({ searchParams: { query } }: Props) => {
    const products =
        await db
            .select()
            .from(product)
            .where(or(ilike(product.name, query), ilike(product.description, query)))
            .orderBy(desc(product.id));

    if (products.length === 0) {
        return <div className="text-center">No products found.</div>

    }

    return (
        <div className="grid grid-cols01 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((product) => (
                <ProductCard product={product} key={product.id} />
            ))}
        </div>
    )
}

export default SearchPage