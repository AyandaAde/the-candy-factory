CREATE TABLE IF NOT EXISTS "product" (
	"id" serial NOT NULL,
	"Product Name" text,
	"Product Desctiption" text,
	"imageUrl" text,
	"Product Price" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
