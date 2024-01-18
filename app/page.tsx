import ProductCard from '@/components/ProductCard';
import PaginationBar from '@/components/PaginationBar';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db'
import { product } from '@/lib/db/schema'
import { count, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import Image from 'next/image'
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { page: string }
}
export default async function Home({ searchParams: { page = "1" } }: Props) {

  const currentPage = parseInt(page);

  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = await db.select().from(product);


  const totalPages = Math.ceil((totalItemCount.length - heroItemCount)) / pageSize;

  const products = await db.select().from(product).orderBy(desc(product.id)).limit(pageSize + (currentPage === 1 ? heroItemCount : 0)).offset((currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount));
  ;
  if (!products) redirect("/error");
  return (
    <div className="flex flex-col items-center">
      {currentPage === 1 &&
        <div className="card lg:card-side bg-base-200 dark:bg-neutral-600 shadow-xl">
          <img
            src={products[0].imageUrl!}
            alt={products[0].name!}
            className="w-full max-w-sm rounded-lg shadow-2xl hover:scale-110 transition duration-500"
          />
          <div className="card-body">
            <h1 className="text-5xl font-bold card-title">{products[0].name}</h1>
            <p className="py-6">{products[0].description}</p>
            <div className="card-actions justify-end">
              <Button>
                <Link
                  href={`/products/${products[0].id}`}
                >Check it out</Link>
              </Button>
            </div>
          </div>
        </div>
      }
      <div className="my-4 grid grid-cols01 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(currentPage === 1 ? products.slice(1) : products).map((product: any) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      {totalPages > 1 &&
        <PaginationBar currentPage={currentPage} totalPages={totalPages} />
      }
    </div>
  )
}
