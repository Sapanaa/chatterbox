import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user-pages";


export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if(req.method !== "POST") {
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const user = await getCurrentUser(req);
        if(!user) return res.status(401).json({error: "Unauthorized"});
        const {content, fileUrl} = req.body;
        const {serverId, channelId} = req.query;

        if(!serverId || !channelId || !content) {
            return res.status(400).json({error: "Missing fields"});
        }

       const server = await prisma.server.findFirst({
        where: {
            id: serverId as string,
            members: {
                some: {
                    userId: user.id
                }
            }
        },
        include: {
            members: true
        }
       });

       if(!server) {
        return res.status(404).json({error: "Server not found"});
       }

       const channel = await prisma.channel.findFirst({
           where: {
               id: channelId as string,
               serverId: serverId as string
           }
       });

       if(!channel) {
        return res.status(404).json({error: "Channel not found"});
       }

       const member = server.members.find((member) => member.userId === user.id);

       if(!member) {
        return res.status(404).json({error: "Member not found"});
       }

       const message = await prisma.message.create({
        data: {
            content,
            fileUrl,
            channelId: channelId as string,
            memberId: member.id
        },
        include: {
            member: {
                include: {
                    user: true
                }
            }
        }
       });

       const channelKey = `chat:${channelId}:messages`;

       res?.socket?.server?.io?.emit(channelKey, message);

       return res.status(200).json(message);
    }

    catch(error){
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }

}