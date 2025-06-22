
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import NavigationAction from "./navigation-action";
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "../mode-toggle";
import NavigationItem from "./navigation-item";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  const UserInitials = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return <span className="font-semibold ">{initials}</span>;
};
 

  return (
   <div className="flex flex-col items-center h-full py-4 px-2 space-y-4 bg-white dark:bg-zinc-950">
      {/* Create Server Button */}
      <div>
        <NavigationAction />
      </div>

      {/* Divider */}
      <Separator className="bg-zinc-300 dark:bg-zinc-700 w-10" />

      {/* Server Items */}
      <div className="flex flex-col space-y-2 overflow-y-auto">
        {servers.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            imageUrl={server.imageUrl}
            name={server.name}
          />
        ))}
      </div>

      {/* Spacer to push toggle and email to bottom */}
      <div className="flex-grow h-20 " />

      {/* Theme Toggle */}
      <div>
        <ModeToggle />
      </div>

      {/* User Email (optional, could be tooltip or icon) */}
      <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <UserInitials name={user.name} />
    </TooltipTrigger>
    <TooltipContent sideOffset={5}>
      <p>{user.name}</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
    </div>
  );
}
