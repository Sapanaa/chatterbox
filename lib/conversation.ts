import prisma from "@/lib/prisma";

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);
    if (!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId);
    }
    return conversation
}
const findConversation = async (memberOneId: string, memberTwoId: string) => {
    return await prisma.conversation.findFirst({
        where: {
            AND: [
                {
                    memberOneId: memberOneId, },
                    {memberTwoId: memberTwoId},

            ],
        },
        include: {
            memberOne: {
                include: {
                    user: true,
                },
            },
            memberTwo: {
                include: {
                    user: true,
                },
            },
        },
    })
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try{
        const memberOne = await prisma.member.findUnique({ where: { id: memberOneId } });
        const memberTwo = await prisma.member.findUnique({ where: { id: memberTwoId } });

        console.log(memberOne, memberTwo);  
        return await prisma.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        user: true,
                    },
                },
                memberTwo: {
                    include: {
                        user: true,
                    },
                },
            },
        })
    } catch (error) {
        console.log(error)
        return null
    }
}