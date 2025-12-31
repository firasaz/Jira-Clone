import { redirect } from "next/navigation";

import { getCurrent } from "@/lib/auth/actions";
import { getWorkspaceAnalytics } from "@/lib/workspaces/actions";
import { getTasks } from "@/lib/tasks/query";
import { getMembers } from "@/lib/members/queries";
import { getProject, getProjects } from "@/lib/projects/queries";

import { useCreateProjectModal } from "@/hooks/projects/use-create-project-modal";
import { useCreateTaskModal } from "@/hooks/tasks/use-create-task-modal";

import { PageError } from "@/components/layout/page-error";
import { Analytics } from "@/components/analytics";

interface WorkspaceIdPageProps {
  params: { workspaceId: string };
}
const WorkspaceIdPage = async ({
  params: { workspaceId },
}: WorkspaceIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const { data: workspaceAnalytics } = await getWorkspaceAnalytics({
    workspaceId,
  });
  const workspaceTasks = await getTasks({
    workspaceId,
  });
  const projects = await getProjects({ workspaceId });
  const workspaceMembers = await getMembers({ workspaceId });

  const { open: createProject } = useCreateProjectModal();
  const { open: createTask } = useCreateTaskModal();

  // no need to check for loading since the component is a server component
  // and the "await" will load the loading.tsx file until all data is loaded

  if (!workspaceAnalytics || !workspaceTasks || !projects || !workspaceMembers)
    return <PageError message="Failed to load workspace data" />;
  return (
    <div className="overflow-y-auto overflow-x-hidden h-full flex flex-col space-y-4">
      <Analytics data={workspaceAnalytics} />
    </div>
  );
};
export default WorkspaceIdPage;
