import Fastify from "fastify";
import { z } from "zod";

const app = Fastify({ logger: true });

type WishlistItem = { id: string; name: string };
const wishlist: WishlistItem[] = [];

app.get("/health", async () => ({ status: "ok" }));

app.get("/cards/search", async (request, reply) => {
  const parsed = z.object({ q: z.string().min(1) }).safeParse(request.query);
  if (!parsed.success) {
    return reply.code(400).send({ error: "Query param 'q' is required" });
  }

  const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(parsed.data.q)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "BinderApp/0.1", Accept: "application/json" },
  });

  if (!res.ok) {
    return reply.code(res.status === 404 ? 404 : 502).send({ error: "Card search failed" });
  }

  const body = (await res.json()) as { data: any[] };
  return body.data.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image_uris?.small ?? null,
    priceUsd: c.prices?.usd ?? null,
  }));
});

app.get("/wishlist", async () => wishlist);

app.post("/wishlist", async (request, reply) => {
  const parsed = z.object({ id: z.string(), name: z.string() }).safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: "Invalid body" });
  if (wishlist.some((w) => w.id === parsed.data.id)) {
    return reply.code(409).send({ error: "Already in wishlist" });
  }
  wishlist.push(parsed.data);
  return reply.code(201).send(parsed.data);
});

app.listen({ port: 3000 }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});