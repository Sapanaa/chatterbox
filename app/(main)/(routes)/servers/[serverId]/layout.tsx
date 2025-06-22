import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ServerSidebar from "@/components/server/server-sidebar";

const serverLayout = async (props: { children: React.ReactNode; params: Promise<{ serverId: string }> }) => {
  const { children, params } = props;
  const {serverId} = await params;

  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex w-60 flex-col fixed z-20 inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
};

export default serverLayout;
