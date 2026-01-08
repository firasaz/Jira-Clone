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
import { TaskList } from "@/components/workspaces/home/task-list";
import { ProjectList } from "@/components/workspaces/home/project-list";
import { MembersList } from "@/components/workspaces/home/members-list";

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
  const workspaceProjects = await getProjects({ workspaceId });
  const workspaceMembers = await getMembers({ workspaceId });

  // no need to check for loading since the component is a server component
  // and the "await" will load the loading.tsx file until all data is loaded

  if (
    !workspaceAnalytics ||
    !workspaceTasks ||
    !workspaceProjects ||
    !workspaceMembers
  )
    return <PageError message="Failed to load workspace data" />;
  return (
    <div className="overflow-y-auto overflow-x-hidden h-full flex flex-col space-y-4">
      <Analytics data={workspaceAnalytics} />
      <div
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        <TaskList
          tasks={workspaceTasks.documents}
          total={workspaceTasks.total}
        />
        <ProjectList
          projects={workspaceProjects.documents}
          total={workspaceTasks.total}
        />
        <MembersList
          members={workspaceMembers.documents}
          total={workspaceMembers.total}
        />
      </div>
    </div>
  );
};
export default WorkspaceIdPage;
