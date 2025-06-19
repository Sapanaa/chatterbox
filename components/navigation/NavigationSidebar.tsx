
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import NavigationAction from "./navigation-action";
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "../mode-toggle";
import NavigationItem from "./navigation-item";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

 

  return (
    <div>
        <div className="mb-4">
            <NavigationAction/>
        </div>
        <Separator />
      {servers.map((server) => (
        <NavigationItem
          key={server.id}
          id={server.id}
          imageUrl={server.imageUrl}
          name={server.name}
        />
      ))}

      <ModeToggle/>
      <p>{user.email}</p>
    </div>

  );
}
