import { redirect } from "next/navigation";

import { getCurrent } from "@/lib/auth/actions";
import { TaskIdClient } from "./client";

const TaskIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <TaskIdClient />;
};

export default TaskIdPage;
