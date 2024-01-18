
import { postgresAdapter } from '@payloadcms/db-postgres'
import * as dotenv from "dotenv";
import { buildConfig } from 'payload/config';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

dotenv.config({
    path: ".env",
  });

export default buildConfig({
  // Your config goes here
  editor: lexicalEditor({}),
  collections: [
    {
        slug: "product",
        fields: [
            {
                name: "name",
                type: "text",
                required: true,
               
            },
            {
                name: 'description',
                type: 'text',
                required: true,
              },
              {
                name: "imageUrl",
                type: "text",
                required: true,
              },
              {
                name: "cartItems",
                type: "relationship",
                relationTo: "cartItems",
              }
        ],
    },
    {
        slug: "cart",
        fields: [
            {
                name: "id",
                type: "number",   
            },
            {
                name: "items",
                type: "relationship",
                relationTo: "cartItems",
            }
        ],
    },
    {
        slug: "cartItems",
        fields: [
            {
                name: "productId",
                type: "number",
            },
            {
                name: "quantity",
                type: "number",
            },
            {
                name: "cartId",
                type: "number",
            },
            {
                name: "product",
                type: "relationship",
                relationTo: "product",
            },
            {
                name: "cart",
                type: "relationship",
                relationTo: "cart",
            }
        ],
    }
  ],
  // Configure the Postgres adapter here
  db: postgresAdapter({
    // Postgres-specific arguments go here.
    // `pool` is required.
    pool: {
      connectionString: process.env.DATABASE_URL,
    }
  }),
})
