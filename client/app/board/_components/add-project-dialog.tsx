"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import MultipleSelector from "@/components/ui/multiple-selector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Column, projectSchema } from "@/typings/project";
import { UseMutationResult } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export default function AddProjectDialog({
  open,
  setOpen,
  columns,
  mutation,
  form,
  onSubmit,
  showCheckmark,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  columns: { [key: string]: Column };
  mutation: UseMutationResult;
  form: UseFormReturn<z.infer<typeof projectSchema>>;
  onSubmit: (values: z.infer<typeof projectSchema>) => void;
  showCheckmark: boolean;
}) {
  const labels = Object.values(columns)
    .flatMap((column) => column.projects.flatMap((project) => project.labels))
    .filter(
      (label, index, self) =>
        index === self.findIndex((t) => t.label === label.label)
    )
    .map((label) => ({ label: label.label, value: label.value }));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
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
                : "Add Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
