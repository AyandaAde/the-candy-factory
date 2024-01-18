import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
neonConfig.fetchConnectionCache = true;
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: Request, res: Response) {
  const response = await sql`SELECT version()`;
  console.log(response);

  return Response.json({
    data: response,
  });
}

export const config = {
  runtime: "edge",
};

export const db = drizzle(sql, {schema});
