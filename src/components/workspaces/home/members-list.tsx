"use client";

import Link from "next/link";
import { SettingsIcon } from "lucide-react";

import { useWorkspaceId } from "@/hooks/workspaces/use-workspace-id";
import { Member } from "@/lib/members/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/components/members/members-avatar";

interface MembersListProps {
  members: Member[];
  total: number;
}
export const MembersList = ({ members, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    // <div>hello world</div>
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className=" flex flex-col h-full bg-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Members {total}</p>
          <Button asChild variant={"secondary"} size={"icon"}>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-2 lg:my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {members.map(member => (
            <li key={member.$id}>
              {/* <Link href={`/workspaces/${workspaceId}/members/${member.$id}`}> */}
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="flex flex-col items-center gap-x-2 p-3">
                  <MemberAvatar name={member.name} className="size-12" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
              {/* </Link> */}
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
        {/* <Button variant={"muted"} className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button> */}
      </div>
    </div>
  );
};
