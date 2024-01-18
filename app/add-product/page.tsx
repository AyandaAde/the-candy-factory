"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label"

type Props = {}

const AddProductPage = (props: Props) => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [price, setPrice] = useState("");

    const addProduct = useMutation({
        mutationFn: async () => {
            const dbPrice = parseInt(price);
            const response = await axios.post("/api/addProduct", {
                name,
                description,
                imageUrl,
                dbPrice,
            });
            return response.data;
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !description || !imageUrl || !price) {
            toast.error("Please enter required fields");
            return;
        }
        addProduct.mutate(undefined, {
            onSuccess({ product }) {
                console.log("created new product", { product });
                toast.success("New Product Added. Redirecting to the Homepage.");
                router.push("/");
            },
            onError(error) {
                console.error(error);
                toast.error("Failed to add prodcut. Please try again.")
            }
        })
    }
    return (
        <div>
            <h1 className="text-lg mb-3 font-bold">
                <form onSubmit={handleSubmit}>
                    <Input
                        required
                        name="name"
                        placeholder="name"
                        className="my-3 w-full"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Textarea
                        required
                        name="description"
                        placeholder="Description"
                        className="mb-3 w-full"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="w-full mb-3 h-[300px] mx-auto md:w-[50%] lg:w-[40%]">
                        <Image
                            src={imageUrl ? imageUrl : "/images/jellybee-wM2gx805g0M-unsplash.jpg"}
                            width={800}
                            height={400}
                            alt="product thumbail"
                            className="object-cover w-full h-full rounded-md mb-2"
                        />
                    </div>
                    <UploadButton
                        className="w-full"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                            setImageUrl(res[0].url);
                            toast.success("Image Uploaded");
                        }}
                        onUploadError={(error: Error) => {
                            console.error(error);
                            toast.error("Failed to upload image. Please try again.")
                        }}
                    />
                    <Label htmlFor="number">Please insert the price in cents (so for $3.00 insert 300)</Label>
                    <Input
                        required
                        name="price"
                        placeholder="Price"
                        type="number"
                        className="mb-3 w-full"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <Button
                        disabled={addProduct.isLoading}
                        className="w-full"
                        type="submit"
                    >{addProduct.isLoading && <Loader2 className="animate-spin" />}Add Product</Button>
                </form>
            </h1>
            <Toaster richColors />
        </div>
    )
}

export default AddProductPage


