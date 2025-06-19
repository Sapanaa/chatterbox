// app/api/channels/route.ts

import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma"; // Adjust your prisma import path
import { getCurrentUser } from "@/lib/current-user";
import { MemberRole } from "@/app/generated/prisma";


export async function POST(req: Request) {
  try {
   
   const user = await getCurrentUser();
    const { name, type } = await req.json();
    const {searchParams} = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing serverId", { status: 400 });
    }
    if(name == "general"){
      return new NextResponse("Channel name cannot be 'general'", { status: 400 });
    }
    const server = await prisma.server.update({
        where: {
            id: serverId,
            members: {
                some: {
                    userId: user.id,
                    role: {
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                    }
                },
            }
        },
        data: {
            channels: {
                create: {
                    userId: user.id,
                    name: name,
                    type: type,
                }
            }
        }
        
    })
    return NextResponse.json(server);   
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
