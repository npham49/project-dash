"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Task } from "@/typings/project";
import { useState } from "react";
import { ModeToggle } from "@/components/theme-switcher";
import { UserButton } from "@/components/user-button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddDialog() {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    interest: "medium",
    labels: [],
  });

  return (
    <div className="flex items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task to add to the backlog.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            {/* radio to select interest */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interest" className="text-right">
                Interest
              </Label>
              <RadioGroup
                // column to take up 3 space
                className="col-span-3"
                id="interest"
                value={newTask.interest}
                defaultValue={newTask.interest}
                onValueChange={(e) =>
                  setNewTask({
                    ...newTask,
                    interest: e as "low" | "medium" | "high",
                  })
                }
              >
                <div className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low 🤨</Label>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium 💛</Label>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High ❤️‍🔥</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button type="submit">Add Task</Button>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
      <ModeToggle />
      <UserButton />
    </div>
  );
}
