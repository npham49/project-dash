"use client";

import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/theme-switcher";
import { UserButton } from "@/components/user-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Column, projectSchema } from "@/typings/project";
import { z } from "zod";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { createProject } from "@/service/api-service";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AddProjectDialog from "./add-project-dialog";

export default function AddDialog({
  columns,
  loading,
  outOfSync,
}: {
  columns: { [key: string]: Column };
  loading: boolean;
  outOfSync: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const queryClient = useQueryClient();
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const defaultValues = {
    title: "",
    description: "",
    interest: "medium" as "medium" | "low" | "high",
    labels: [],
    columnIndex: columns.idea.projects.length,
  };

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (project: z.infer<typeof projectSchema>) => {
      const token = getAccessTokenRaw();
      if (!token) {
        throw new Error("Access token is null");
      }
      return createProject(project, token);
    },
    onSuccess: () => {
      setShowCheckmark(true);
      setTimeout(() => {
        setOpen(false);
        setShowCheckmark(false);
      }, 1500);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof projectSchema>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open, form]);

  return (
    <div className="flex items-center space-x-2 ">
      {loading ? (
        <div className="flex items-center space-x-2">
          <p className="text-sm bg-muted px-2 py-1 rounded-md">Syncing...</p>
          <LoadingSpinner className="h-4 w-4 px-2" />
        </div>
      ) : outOfSync ? (
        <div className="flex items-center space-x-2">
          <p className="text-sm bg-muted px-2 py-1 rounded-md">Out of sync</p>
          <AddProjectDialog
            open={open}
            setOpen={setOpen}
            columns={columns}
            mutation={
              mutation as UseMutationResult<
                z.infer<typeof projectSchema>,
                Error
              >
            }
            form={form}
            onSubmit={onSubmit}
            showCheckmark={showCheckmark}
          />
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <p className="text-sm bg-muted px-2 py-1 rounded-md text-muted-foreground">
            Synced
          </p>
          <AddProjectDialog
            open={open}
            setOpen={setOpen}
            columns={columns}
            mutation={
              mutation as UseMutationResult<
                z.infer<typeof projectSchema>,
                Error
              >
            }
            form={form}
            onSubmit={onSubmit}
            showCheckmark={showCheckmark}
          />
        </div>
      )}
      <ModeToggle />
      <UserButton />
    </div>
  );
}
