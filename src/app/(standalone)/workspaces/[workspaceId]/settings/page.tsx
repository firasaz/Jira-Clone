import { redirect } from "next/navigation";

import { getCurrent } from "@/lib/auth/actions";
import { getWorkspace } from "@/lib/workspaces/actions";
import { UpdateWorkspaceForm } from "@/components/workspaces/update-workspace-form";

interface UpdateWorkspaceFormProps {
  params: {
    workspaceId: string;
  };
}

const UpdateWorkspacePage = async ({ params }: UpdateWorkspaceFormProps) => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });
  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default UpdateWorkspacePage;
