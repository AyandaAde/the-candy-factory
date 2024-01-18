import { ProductType } from "@/lib/db/schema";
import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";
import { Button } from "./ui/button";

type ProductCardProps = {
    product: ProductType;
}

const ProductCard = async ({ product }: ProductCardProps) => {
    const isNew = Date.now() - new Date(product.createdAt!).getTime() < 1000 * 60 * 60 * 24 * 7;

    return (
        <Link
            href={`/products/${product.id}`}
            className=" group card mx-auto w-[300px] lg:w-96 bg-base-100 dark:bg-neutral-700 shadow-md hover:shadow-xl transition-shadow"
        >
            <figure><Image
                width={800}
                height={800}
                src={product.imageUrl!}
                alt={product.name!}
                className="h-48 md:h-72 w-full object-cover group-hover:scale-110 transition duration-500"
            /></figure>
            <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                {isNew && <div className="badge badge-secondary">NEW</div>}
                <p>{product.description}</p>
                <PriceTag price={product.price!} />
                <div className="card-actions z-30 justify-end">
                    <Button>View Product</Button>
                </div>
            </div>
        </Link >
    )
}

export default ProductCard