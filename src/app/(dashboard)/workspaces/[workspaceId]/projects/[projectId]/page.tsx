import { ProjectsAvatar } from "@/components/projects/projects-avatar";
import { TaskViewSwitcher } from "@/components/tasks/task-view-switcher";
import { Button } from "@/components/ui/button";
import { getCurrent } from "@/lib/auth/actions";
import { getProject } from "@/lib/projects/queries";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface ProjectIdPageProps {
  params: { projectId: string };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const initialValues = await getProject({
    projectId: params.projectId,
  });
  if (!initialValues) throw new Error("Project not found");

  return (
    <div className="flex flex-col gap-y-4 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <ProjectsAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter={true} />
    </div>
  );
};

export default ProjectIdPage;
