import { redirect } from "next/navigation";
import { getCurrent } from "@/lib/auth/actions";
import { MembersList } from "@/components/workspaces/members-list";

const WorkspaceIdMembersPage = () => {
  // protect route
  const user = getCurrent();
  if (!user) redirect("/login");
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
