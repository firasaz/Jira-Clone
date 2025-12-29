import { redirect } from "next/navigation";

import { getCurrent } from "@/lib/auth/actions";
import { TaskViewSwitcher } from "@/components/tasks/task-view-switcher";

const TasksPage = () => {
  const user = getCurrent();
  if (!user) redirect("/login");

  return <TaskViewSwitcher />;
};

export default TasksPage;
