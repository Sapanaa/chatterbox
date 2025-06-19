import { MemberRole } from '@/app/generated/prisma';
import { auth } from '@/lib/auth';  // your better-auth setup
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      query: { disableCookieCache: true },
      headers: req.headers,
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    const server = await prisma.server.create({
      data: {
        userId: session.user.id,
        name: name,
        imageUrl: "",
        inviteCode: uuidv4(),
        channels: {
          create: {
            name: "general",
            userId: session.user.id,
            type: "TEXT",
          },
        },
        members: {
          create: {
            userId: session.user.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    return new Response(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


