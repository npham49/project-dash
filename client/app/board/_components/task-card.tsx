"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit2Icon, NotebookPenIcon } from "lucide-react";
import { Column, Project } from "@/typings/project";
import { Option } from "@/components/ui/multiple-selector";
import EditNotesDialog from "./edit-notes-dialog";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import EditTaskDialog from "./edit-task-dialog";

interface TaskCardProps {
  project: Project;
  provided: any;
  columns: { [key: string]: Column };
}

function getInterestColor(interest: string) {
  switch (interest) {
    case "low":
      return "🤨";
    case "medium":
      return "💛";
    case "high":
      return "❤️‍🔥";
    default:
      return "🤷‍♂️";
  }
}

export function TaskCard({ project, provided, columns }: TaskCardProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="mb-2 cursor-move bg-background"
    >
      <CardHeader className="p-3 pb-0 flex flex-row justify-between">
        <CardTitle className="text-base font-semibold">
          {project.title}
        </CardTitle>
        <div className="flex space-x-2">
          <OpenInNewWindowIcon className="w-4 h-4 text-primary/80 cursor-pointer hover:h-5 hover:w-5 hover:text-primary" />
          <EditNotesDialog project={project}>
            <NotebookPenIcon className="w-4 h-4 text-primary/80 cursor-pointer hover:h-5 hover:w-5 hover:text-primary" />
          </EditNotesDialog>
          <EditTaskDialog project={project} columns={columns}>
            <Edit2Icon className="w-4 h-4 text-primary/80 cursor-pointer hover:h-5 hover:w-5 hover:text-primary" />
          </EditTaskDialog>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <p className="text-sm text-gray-500 mb-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {project.labels.map((label: Option) => (
            <Badge key={label.value} variant="secondary" className="text-xs">
              {label.label}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex space-x-2">
          {isClient && <Clock className="w-4 h-4 text-gray-400" />}
          <span className="text-xs text-gray-500">{project.createdDate}</span>
        </div>
        <div className="text-lg w-5 h-5 rounded-full">
          {getInterestColor(project.interest)}
        </div>
      </CardFooter>
    </Card>
  );
}
