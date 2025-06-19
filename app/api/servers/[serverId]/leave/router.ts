import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function DELETE(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const serverId = params.serverId;
    if(!serverId) return NextResponse.json({ error: "Missing serverId" }, { status: 400 });
    // Optional: check if user has permission to delete this member

    const server = await prisma.server.update({
        where: {
            id: serverId,
            userId: {
                not: user.id
            },
              members: {
            some: {
                userId: user.id
            }
        }
        },
        data: {
            members: {
                deleteMany: {
                    userId: user.id
                }
            }
        },
      
       
    })

    return NextResponse.json(server);
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}