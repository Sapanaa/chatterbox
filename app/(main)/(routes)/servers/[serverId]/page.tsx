import { getCurrentUser } from '@/lib/current-user'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

interface ServerPageProps {
  params: {
    serverId: string
  }
}
const ServerPage = async  ({params}: ServerPageProps) => {
  const user = await getCurrentUser();

  if(!user) return redirect("/login");
  
  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  const initialChannel = server?.channels[0];

  if(initialChannel?.name !== "general") {
    return null;
  }


  return redirect(`/servers/${server?.id}/channels/${initialChannel?.id}`);
}

export default ServerPage
