"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import TailwindEditor from "./editor";
import { Project } from "@/typings/project";
import { createNote, updateNote } from "@/service/api-service";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function EditNotesDialog({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (content: JSONContent) => {
      const token = getAccessTokenRaw();
      if (!token) {
        throw new Error("Access token is null");
      }
      if (!project.id) {
        throw new Error("Project ID is required");
      }
      return updateNote(token, project.id, content);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note updated",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const token = getAccessTokenRaw();
      if (!token) {
        throw new Error("Access token is null");
      }
      const note = createNote(token, project.id, {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: {
              level: 1,
            },
            content: [
              {
                type: "text",
                text: "Let's ideate 💡",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "How do we do this?",
              },
            ],
          },
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      return note;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-[1600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto">
          {createMutation.isPending ? (
            <LoadingSpinner />
          ) : createMutation.isError ? (
            <div>Error</div>
          ) : createMutation.isSuccess ? (
            <TailwindEditor
              initialContent={project.note?.content}
              updateContent={updateMutation}
            />
          ) : (
            <Button onClick={() => createMutation.mutate()}>Create Note</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
