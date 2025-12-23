import { Loader } from "lucide-react";

import { useGetMembers } from "@/hooks/members/use-get-members";
import { useGetProjects } from "@/hooks/projects/use-get-projects";
import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { Card, CardContent } from "@/components/ui/card";
import { CreateTaskForm } from "@/components/tasks/create-task-form";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map(project => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const memberOptions = members?.documents.map(member => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading)
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex justify-center items-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  return (
    <div className="w-full">
      {/* <EditTaskForm
        onCancel={onCancel}
        projectOptions={projectOptions ?? []}
        memberOptions={memberOptions ?? []}
      /> */}
    </div>
  );
};
