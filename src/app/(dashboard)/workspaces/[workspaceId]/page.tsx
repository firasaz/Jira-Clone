import { redirect } from "next/navigation";

import { getCurrent } from "@/lib/auth/actions";
import { getWorkspaceAnalytics } from "@/lib/workspaces/actions";

interface WorkspaceIdPageProps {
  params: { workspaceId: string };
}
const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  const workspaceAnalytics = await getWorkspaceAnalytics({
    workspaceId: params.workspaceId,
  });

  return <div>{JSON.stringify(workspaceAnalytics)}</div>;
};
export default WorkspaceIdPage;
