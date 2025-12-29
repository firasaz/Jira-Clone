import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

import { CreateWorkspaceModal } from "@/components/workspaces/create-workspace-modal";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { EditTaskModal } from "@/components/tasks/edit-task-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className="flex size-full">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-auto">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full flex flex-col">
            <Navbar />
            <main className="h-full py-5 px-4 lg:py-7 lg:px-6 flex flex-col overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
