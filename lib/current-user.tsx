import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const originalHeaders = await headers(); // ✅ this returns Headers (not plain object)

  const h = new Headers(); // ✅ build a proper Headers instance

  const cookie = originalHeaders.get("cookie");
  if (cookie) h.set("cookie", cookie);

  // authorization may or may not be needed depending on your auth setup
  const authorization = originalHeaders.get("authorization");
  if (authorization) h.set("authorization", authorization);

  const session = await auth.api.getSession({
    query: { disableCookieCache: true },
    headers: h, // ✅ pass real Headers object
  });

  return session?.user || null;
}
