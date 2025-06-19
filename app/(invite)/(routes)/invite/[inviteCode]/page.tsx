import { getCurrentUser } from '@/lib/current-user'
import { redirect } from 'next/navigation';
import React from 'react'
import prisma from '@/lib/prisma';

interface InviteCodePageProps {
    params: { inviteCode: string }
}
const InviteCodePage = async ({params}: InviteCodePageProps) => {
    const user = await getCurrentUser();

    if(!user) return redirect("/login");

    if(!params.inviteCode) return redirect("/");

    const existingServer = await prisma.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    userId: user.id
                }
            }
        }
    })

    if(existingServer) return redirect(`/servers/${existingServer.id}`);

    const server = await prisma.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                    userId: user.id
                    }
                ]
            }
        }
    })

    if(server) return redirect(`/servers/${server.id}`);


  return (
    <div>
      Hello Invite
    </div>
  )
}

export default InviteCodePage
