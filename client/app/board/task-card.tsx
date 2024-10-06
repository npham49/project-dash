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
import { Clock } from "lucide-react";
import { Task } from "@/typings/project";

interface TaskCardProps {
  task: Task;
  provided: any;
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

export function TaskCard({ task, provided }: TaskCardProps) {
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
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base font-semibold hover:underline cursor-pointer">
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <p className="text-sm text-gray-500 mb-2">{task.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((label) => (
            <Badge key={label} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isClient && <Clock className="w-4 h-4 text-gray-400" />}
          <span className="text-xs text-gray-500">{task.createdDate}</span>
        </div>
        <div className="text-lg w-5 h-5 rounded-full">
          {getInterestColor(task.interest)}
        </div>
      </CardFooter>
    </Card>
  );
}
