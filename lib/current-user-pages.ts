import { auth } from "@/lib/auth";
import { NextApiRequest } from "next";

export async function getCurrentUser(req: NextApiRequest) {
  const headers = new Headers();

  // Copy the cookie header from the request
  const cookie = req.headers.cookie;
  if (cookie) headers.set("cookie", cookie);

  // Optional: Authorization header
  const authorization = req.headers.authorization;
  if (authorization) headers.set("authorization", authorization);

  const session = await auth.api.getSession({
    query: { disableCookieCache: true },
    headers,
  });

  return session?.user || null;
}
