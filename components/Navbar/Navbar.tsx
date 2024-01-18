import Image from "next/image"
import Link from "next/link"
import { Input } from "../ui/input"
import { redirect } from "next/navigation"
import { getCart } from "@/lib/db/cart"
import ShoppingCartButton from "../ShoppingCartButton"
import { UserButton, auth } from "@clerk/nextjs"
import { Button } from "../ui/button"


type Props = {}

async function searchProducts(formData: FormData) {
    "use server";
    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
        redirect("/search?query=" + searchQuery);
    }
}
const Navbar = async (props: Props) => {
    const { userId } = await auth();
    const isAuth = !!userId;
    const cart = await getCart();
    return (
        <>
            <div className="navbar flex-col justify-between items-center m-auto bg-base-100 dark:bg-black dark:text-white dark:border-b-[1px] dark:border-b-neutral-600 shadow">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl normal-case">
                        <Image
                            src="/images/logo.jpg"
                            width={40}
                            height={40}
                            alt="The Candy Factory"
                        ></Image>
                        The Candy Factory
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    <form action={searchProducts}>
                        <div className="form-control">
                            <Input
                                name="searchQuery"
                                placeholder="Search"
                                className="w-full min-w-[100px]"
                            />
                        </div>
                    </form>
                    <ShoppingCartButton cart={cart} />
                    {isAuth ?
                        <UserButton />
                        : <Button>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>}
                </div>
            </div>
            {/* <div className="hidden navbar md:flex flex-row justify-between items-center m-auto bg-base-100 dark:bg-black dark:text-white dark:border-b-[1px] dark:border-b-neutral-600 shadow">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl normal-case">
                        <Image
                            src="/images/logo.jpg"
                            width={40}
                            height={40}
                            alt="The Candy Factory"
                        ></Image>
                        The Candy Factory
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    <form action={searchProducts}>
                        <div className="form-control">
                            <Input
                                name="searchQuery"
                                placeholder="Search"
                                className="w-full min-w-[100px]"
                            />
                        </div>
                    </form>
                    <ShoppingCartButton cart={cart} />
                    {isAuth ?
                        <UserButton />
                        : <Button>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>}
                </div>
            </div> */}
        </>
    )
}

export default Navbar