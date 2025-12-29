"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "./auth/user-button";
import { MobileSidebar } from "./mobile-sidebar";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here.",
  },
  projects: {
    title: "My Project",
    description: "View tasks of your project here.",
  },
};
const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};
export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;
  const { title, description } = pathnameMap[pathnameKey] || defaultMap;
  return (
    <nav className="pt-5 px-4 lg:pt-6 lg:px-6 flex justify-between items-center">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {/* the mobile sidebar is lg:hidden, which is the opposite of the above div so they will replace each other on the "lg" screen size */}
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
