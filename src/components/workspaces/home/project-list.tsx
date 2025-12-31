"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Project } from "@/lib/projects/types";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { useCreateProjectModal } from "@/hooks/projects/use-create-project-modal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { ProjectsAvatar } from "@/components/projects/projects-avatar";

interface ProjectListProps {
  projects: Project[];
  total: number;
}
export const ProjectList = ({ projects, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1 min-h-0">
      <div className=" flex flex-col h-full bg-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Projects {total}</p>
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => createProject()}
          >
            <PlusIcon className="size-4 text-neutral" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
          {projects.map(project => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectsAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
        <Button variant={"muted"} className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};
