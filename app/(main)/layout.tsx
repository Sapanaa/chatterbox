import NavigationSidebar from "@/components/navigation/NavigationSidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 w-[72px] z-30 flex-col bg-white dark:bg-zinc-900 shadow-lg border-r">
        <NavigationSidebar />
      </aside>

      {/* Main Content */}
      <main className="md:pl-[72px] h-full w-full overflow-y-auto">
        <div className="h-full p-4">{children}</div>
      </main>
    </div>
  );
}
