import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, description, imageUrl, dbPrice } = body;
    await db.insert(product).values({
      name,
      description,
      imageUrl,
      price: dbPrice,
    });

    return new NextResponse("Product sussessfully added.");
  } catch (error) {
    return new NextResponse("Failed to upload product", { status: 500 });
  }
}
