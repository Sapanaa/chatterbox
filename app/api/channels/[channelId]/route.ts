import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma"; // Adjust your prisma import path
import { getCurrentUser } from "@/lib/current-user";
import { MemberRole } from "@/app/generated/prisma";

export async function DELETE (req: Request, { params }: { params: { channelId: string } }) {
    try {
        const user = await getCurrentUser();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!serverId) return NextResponse.json({ error: 'Missing serverId' }, { status: 400 });

        const channelId = params.channelId;
        if (!channelId) return NextResponse.json({ error: 'Missing channelId' }, { status: 400 });

        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        userId: user.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error('PATCH /api/channels/[channelId] error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

