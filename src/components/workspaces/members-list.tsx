"use client";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-7">
        <Button variant={"secondary"} size={"sm"} asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
};
