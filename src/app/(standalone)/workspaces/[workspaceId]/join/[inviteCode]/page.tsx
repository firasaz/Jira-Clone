import { redirect } from "next/navigation";

import { getCurrent } from "@/lib/auth/actions";
import { getWorkspaceData } from "@/lib/workspaces/actions";

import { JoinWorkspaceForm } from "@/components/workspaces/join-workspace-form";

interface JoinPageProps {
  params: {
    workspaceId: string;
  };
}
const JoinPage = async ({ params }: JoinPageProps) => {
  // protect route
  const user = await getCurrent();
  if (!user) redirect("/login");

  const workspace = await getWorkspaceData({
    workspaceId: params.workspaceId,
  });
  if (!workspace) redirect("/");
  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default JoinPage;
