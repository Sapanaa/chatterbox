import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { Message } from "@/app/generated/prisma";

export async function GET (req: Request) {
    const MESSAGE_BATCH = 10;
    try {
            const user = await getCurrentUser();
            const {searchParams} = new URL(req.url);

            const cursor = searchParams.get("cursor");
            const channelId = searchParams.get("channelId");

            if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            if (!channelId) return NextResponse.json({ error: 'Missing channelId' }, { status: 400 });

            let messages: Message[] = [];
            
            if (cursor) {
                messages = await prisma.message.findMany({
                    take: MESSAGE_BATCH,
                    skip: 1,
                    cursor: {
                        id: cursor
                    },
                    where: {
                        channelId: channelId
                    },
                    include: {
                        member: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }
            else {
                messages = await prisma.message.findMany({
                    take: MESSAGE_BATCH,
                    where: {
                        channelId: channelId
                    },
                    include: {
                        member: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
            }

            let nextCursor = null;
            if (messages.length === MESSAGE_BATCH) {
                nextCursor = messages[MESSAGE_BATCH - 1].id;
            }
          
            return NextResponse.json({ items: messages, nextCursor });

    }
    catch (error) {
        console.error('GET /api/messages error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }


}