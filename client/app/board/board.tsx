"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Column } from "@/typings/project";
import AddDialog from "./add-dialog";
import { TaskCard } from "./task-card";

// Initial state for the Kanban board
const initialColumns: { [key: string]: Column } = {
  ideas: {
    id: "ideas",
    title: "Ideas 📋",
    tasks: [
      {
        id: "task-1",
        title: "Plan project scope",
        description: "Define the project boundaries and objectives",
        createdDate: "2023-06-30",
        interest: "high",
        labels: ["planning", "strategy"],
      },
      {
        id: "task-2",
        title: "Create wireframes",
        description: "Design initial layouts for key pages",
        createdDate: "2023-07-15",
        interest: "medium",
        labels: ["design", "ux"],
      },
    ],
  },
  brainstorm: {
    id: "brainstorm",
    title: "Brainstorm 🤔",
    tasks: [
      {
        id: "task-3",
        title: "Design UI components",
        description: "Create a cohesive design system for the application",
        createdDate: "2023-07-30",
        interest: "high",
        labels: ["design", "ui"],
      },
      {
        id: "task-4",
        title: "Set up development environment",
        description: "Configure necessary tools and frameworks",
        createdDate: "2023-07-10",
        interest: "low",
        labels: ["setup", "dev-ops"],
      },
    ],
  },
  building: {
    id: "building",
    title: "Building 🛠️",
    tasks: [
      {
        id: "task-5",
        title: "Implement authentication",
        description: "Set up user login and registration system",
        createdDate: "2023-08-15",
        interest: "high",
        labels: ["backend", "security"],
      },
      {
        id: "task-6",
        title: "Develop API endpoints",
        description: "Create necessary API routes for frontend consumption",
        createdDate: "2023-08-30",
        interest: "medium",
        labels: ["backend", "api"],
      },
    ],
  },
  launched: {
    id: "launched",
    title: "Launched 🚀",
    tasks: [
      {
        id: "task-7",
        title: "Project kickoff meeting",
        description: "Initial team meeting to align on project goals",
        createdDate: "2023-06-01",
        interest: "high",
        labels: ["meeting", "planning"],
      },
      {
        id: "task-8",
        title: "Requirements gathering",
        description: "Collect and document project requirements",
        createdDate: "2023-06-15",
        interest: "medium",
        labels: ["analysis", "documentation"],
      },
    ],
  },
  afterLaunch: {
    id: "afterLaunch",
    title: "After Launch Support 🔄",
    tasks: [
      {
        id: "task-9",
        title: "Monitor system performance",
        description: "Track and analyze application metrics post-launch",
        createdDate: "2023-10-01",
        interest: "medium",
        labels: ["monitoring", "maintenance"],
      },
      {
        id: "task-10",
        title: "Gather user feedback",
        description: "Collect and analyze user responses to the new system",
        createdDate: "2023-10-15",
        interest: "high",
        labels: ["feedback", "user-experience"],
      },
    ],
  },
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside the list or in the same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Create a new columns object to avoid direct state mutation
    const newColumns = { ...columns };

    // Remove the task from the source column
    const sourceColumn = newColumns[source.droppableId];
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    // Add the task to the destination column
    const destColumn = newColumns[destination.droppableId];
    destColumn.tasks.splice(destination.index, 0, movedTask);

    // Update the state with the new columns
    setColumns(newColumns);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex justify-between items-center p-4 z-10">
        <h1 className="text-2xl font-bold">Let's ideate 💡</h1>
        <AddDialog />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex h-full">
            {Object.values(columns).map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-muted/90 p-2 rounded-lg mx-1 h-full min-w-[280px] w-full"
                  >
                    <h2 className="font-semibold p-4">{column.title}</h2>
                    <div className="overflow-y-auto h-[calc(100%-60px)]">
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <TaskCard task={task} provided={provided} />
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
