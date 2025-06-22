import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user-pages";
import { MemberRole } from "@/app/generated/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {

    if(req.method != "DELETE" && req.method != "PATCH") {
        return res.status(405).json({error: "Method not allowed"});
    }

    try{
        const user = await getCurrentUser(req);
        const {directMessageId, conversationId} = req.query;
        const {content} = req.body;

        if(!user) return res.status(401).json({error: "Unauthorized"});
        if(!directMessageId) return res.status(400).json({error: "Missing serverId"});
        if(!conversationId) return res.status(400).json({error: "Missing channelId"});   

     

        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            userId: user.id
                        }
                    },
                    {
                        memberTwo: {
                            userId: user.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        user: true
                    }
                },
                memberTwo: {
                    include: {
                        user: true
                    }
                }
            }
        });
                
    
        if(!conversation) return res.status(404).json({error: "Conversation not found"});

        const 

        const member = server.members.find((member) => member.userId === user.id);

        if(!member) return res.status(404).json({error: "Member not found"});

        let message = await prisma.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if(!message || message.deleted) return res.status(404).json({error: "Message not found"});

        if(message.memberId !== member.id) return res.status(401).json({error: "Unauthorized"});
        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR
        const canModify = isMessageOwner || isAdmin || isModerator;

        if(!canModify) return res.status(401).json({error: "Unauthorized"});

        if(req.method == "DELETE") {
            message = await prisma.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted.",
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            });
        }
        
        if(req.method == "PATCH") {
            if(!isMessageOwner) return res.status(401).json({error: "Unauthorized"});
            message = await prisma.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            });
        }

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}
