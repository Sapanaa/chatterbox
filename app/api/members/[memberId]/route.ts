import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function PATCH(req: NextRequest, { params }: { params: { memberId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const memberId = params.memberId;
    const { searchParams } = new URL(req.url);
    const {role} = await req.json();


    const serverId = searchParams.get("serverId");

    if (!serverId) return NextResponse.json({ error: "Missing serverId" }, { status: 400 });

    if (!memberId) return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    if (!role) return NextResponse.json({ error: "Missing role" }, { status: 400 });

    // Optionally verify if current user has permission to update this member in this server
    const server = await prisma.server.update({
        where : {
            id : serverId,
            userId: user.id
        },
        data : {
            members: {
                update: {
                    where: {
                        id: memberId,
                        userId:{
                            not: user.id
                        }
                    },
                    data: {
                        role
                    }
                }
            }
        },
        include: {
            members: {
                include: {
                    user: true
                },
                orderBy: {
                    role: "asc",
                },
            },
        }
    })
    return new NextResponse(JSON.stringify(server));

  } catch (error) {
    console.error("PATCH /api/members/[memberId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
