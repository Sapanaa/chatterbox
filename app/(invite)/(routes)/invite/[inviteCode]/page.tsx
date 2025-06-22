
import { getCurrentUser } from '@/lib/current-user'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import React from 'react'

interface InviteCodePageProps {
  params: {
    inviteCode: string
  }
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const { inviteCode } = params

  const user = await getCurrentUser()
  if (!user) return redirect("/login")

  if (!inviteCode) return redirect("/")

  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          userId: user.id
        }
      }
    }
  })

  if (existingServer) return redirect(`/servers/${existingServer.id}`)

  const server = await prisma.server.update({
    where: {
      inviteCode
    },
    data: {
      members: {
        create: {
          userId: user.id
        }
      }
    }
  })

  if (server) return redirect(`/servers/${server.id}`)

  return (
    <div className="p-4 text-center text-zinc-500">
      <h1 className="text-2xl font-bold">Joining server...</h1>
    </div>
  )
}

export default InviteCodePage
