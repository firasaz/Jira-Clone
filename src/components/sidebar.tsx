import Link from "next/link";

import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-separator";
import { Logo } from "./logo";
import { WorkspaceSwitcher } from "./workspaces/workspace-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
  return (
    <aside className="size-full bg-neutral-100 p-4">
      <Link href="/">
        <Logo />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
