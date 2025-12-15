"use client";

import React, { useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";

import { toast } from "sonner";

import { Workspace } from "@/lib/workspaces/types";
import { updateWorkspaceSchema } from "@/lib/workspaces/schemas";

import { useUpdateWorkspace } from "@/hooks/workspaces/use-update-workspace";
import { useDeleteWorkspace } from "@/hooks/workspaces/use-delete-workspace";

import { useConfirm } from "@/hooks/workspaces/use-confirm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useResetInviteCode } from "@/hooks/workspaces/use-reset-invite-code";

interface UpdateWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const UpdateWorkspaceForm = ({
  onCancel,
  initialValues,
}: UpdateWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResetingInviteCode } =
    useResetInviteCode();
  const inputRef = useRef<HTMLInputElement>(null);

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone.",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite code",
    "This will invalidate the invite link",
    "destructive"
  );

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });
  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
          // onCancel?.(); // add a null check as the onCancel is optional in the interface
        },
      }
    );
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) form.setValue("image", file);
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };
  const handleReset = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    resetInviteCode(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.refresh(); // refetch server components to update the UI for the invite code after reseting
        },
      }
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  const handleCopyInvite = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied"));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="size-full shadow-none border-none">
        <CardHeader className="flex p-7 flex-row items-center gap-x-4 space-y-0">
          <Button
            size="sm"
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="size-">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="relative size-[72px] rounded-md overflow-hidden">
                              <Image
                                src={
                                  field.value instanceof File // when you select the file, the field will be a File
                                    ? URL.createObjectURL(field.value)
                                    : field.value // when updating the image after submitting the form, the file will be a URL
                                }
                                alt="workspace image"
                                className="object-coover"
                                fill
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm">Workspace Icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, JPEG, PNG, SVG, or GIF, max 1MB
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=".jpg, .jpeg, .png, .svg, .gif"
                              ref={inputRef}
                              disabled={isPending}
                              onChange={handleImageChange}
                            />
                            {field.value ? (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"destructive"}
                                size={"xs"}
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current)
                                    inputRef.current.value = "";
                                }}
                              >
                                Remove Image
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"teritary"}
                                size={"xs"}
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click()}
                              >
                                Upload Image
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant={"secondary"}
                  size={"lg"}
                  onClick={onCancel}
                  disabled={isPending}
                  className={!onCancel ? "invisible" : ""}
                >
                  Cancel
                </Button>
                <Button type="submit" size={"lg"} disabled={isPending}>
                  Update Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="size-full shadow-none border-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInvite}
                  variant={"secondary"}
                  className="size-12"
                >
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isPending || isResetingInviteCode}
              onClick={handleReset}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="size-full shadow-none border-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
