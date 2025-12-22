import { UpdateProjectForm } from "@/components/projects/update-project-form";
import { getCurrent } from "@/lib/auth/actions";
import { getProject } from "@/lib/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string;
  };
}
const ProjectIdSettingsPage = async ({
  params,
}: ProjectIdSettingsPageProps) => {
  // protect route
  const user = await getCurrent();
  if (!user) redirect("/login");

  const initialValues = await getProject({ projectId: params.projectId });

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectIdSettingsPage;
