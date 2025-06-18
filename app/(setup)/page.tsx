import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  // if (server) {
  //   return redirect(`/servers/${server.id}`);
  // }

  return (
    <div>
      <p>Create a server</p>
      <p>Join a server</p>
      {/* Your modal/component */}
    </div>
  );
}
