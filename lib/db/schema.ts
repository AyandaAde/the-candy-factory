import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const product = pgTable("product", {
  id: serial("id").primaryKey(),
  name: text("Product Name"),
  description: text("Product Desctiption"),
  imageUrl: text("imageUrl"),
  price: integer("Product Price"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productRelations = relations(product, ({ many }) =>({
  cartItems: many(cartItems),
}))


export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartRelations = relations(cart, ({many}) => ({
  items: many(cartItems),
}))

export const cartItems = pgTable("cartItem", {
  id: serial("id").primaryKey(),
  productId: integer("productId").notNull().references(()=>product.id, {onDelete: "cascade"}),
  quantity: integer("quantity"),
  cartId: integer("cartId").notNull().references(()=>cart.id, {onDelete: "cascade" }),
})

export const cartItemsRelations = relations(cartItems, ({one}) => ({
  product: one(product, {
    fields: [cartItems.productId],
    references: [product.id],
  }),
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  })
}))

export type ProductType = typeof product.$inferInsert;
export type CartType = typeof cart.$inferSelect;
export type CartItemType = typeof cartItems.$inferInsert;


