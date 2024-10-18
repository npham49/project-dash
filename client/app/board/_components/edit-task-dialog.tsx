"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Column, Project, projectSchema } from "@/typings/project";
import { updateProject } from "@/service/api-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useKindeAuth,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MultipleSelector from "@/components/ui/multiple-selector";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Check } from "lucide-react";

interface EditTaskDialogProps {
  project: Project;
  columns: { [key: string]: Column };
  children: React.ReactNode;
}

export default function EditTaskDialog({
  project,
  children,
  columns,
}: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const queryClient = useQueryClient();
  const { getAccessTokenRaw } = useKindeBrowserClient();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: project,
  });

  const mutation = useMutation({
    mutationFn: (project: z.infer<typeof projectSchema>) => {
      const token = getAccessTokenRaw();
      if (!token) {
        throw new Error("Access token is null");
      }
      if (!project.id) {
        throw new Error("Project ID is required");
      }
      return updateProject(project.id, project, token);
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
    console.log(values);
    mutation.mutate(values);
  }

  const labels = Object.values(columns)
    .flatMap((column) => column.projects.flatMap((project) => project.labels))
    .filter(
      (label, index, self) =>
        index === self.findIndex((t) => t.label === label.label)
    )
    .map((label) => ({ label: label.label, value: label.value }));

  useEffect(() => {
    if (!open) {
      form.reset(project);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task to add to the backlog.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="space-x-2">
                        <FormControl>
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">Low 🤨</FormLabel>
                      </FormItem>
                      <FormItem className="space-x-2">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">Medium 💛</FormLabel>
                      </FormItem>
                      <FormItem className="space-x-2">
                        <FormControl>
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">High ❤️‍🔥</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="labels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labels</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={field.value}
                      options={labels}
                      onChange={field.onChange}
                      creatable
                      placeholder="Select labels..."
                      emptyIndicator={
                        <p className="text-center">No results found.</p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={mutation.isPending || showCheckmark}
            >
              {mutation.isPending ? (
                <LoadingSpinner className="h-4 w-4 mr-2" />
              ) : showCheckmark ? (
                <Check className="h-4 w-4 mr-2" />
              ) : null}
              {mutation.isPending
                ? "Creating..."
                : showCheckmark
                ? "Created!"
                : "Update Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
