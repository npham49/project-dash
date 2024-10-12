"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Column, Project } from "@/typings/project";
import AddDialog from "./add-dialog";
import { TaskCard } from "./task-card";
import { useUserStore } from "@/store/user-store-provider";

export default function KanbanBoard({ projects }: { projects: Project[] }) {
  // Initial state for the Kanban board
  const initialColumns: { [key: string]: Column } = {
    ideas: {
      id: "ideas",
      title: "Ideas 📋",
      projects: projects || [],
    },
    brainstorm: {
      id: "brainstorm",
      title: "Brainstorm 🤔",
      projects: [],
    },
    building: {
      id: "building",
      title: "Building 🛠️",
      projects: [],
    },
    launched: {
      id: "launched",
      title: "Launched 🚀",
      projects: [],
    },
    afterLaunch: {
      id: "afterLaunch",
      title: "After Launch Support 🔄",
      projects: [],
    },
  };
  const [columns, setColumns] = useState(initialColumns);
  const user = useUserStore((state) => state.user);

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
    const [movedTask] = sourceColumn.projects.splice(source.index, 1);

    // Add the task to the destination column
    const destColumn = newColumns[destination.droppableId];
    destColumn.projects.splice(destination.index, 0, movedTask);

    // Update the state with the new columns
    setColumns(newColumns);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex justify-between items-center p-4 z-10">
        <h1 className="text-2xl font-bold">
          {user.firstName}, let's ideate 💡
        </h1>
        <AddDialog />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1">
          <div className="flex h-full">
            {Object.values(columns).map((column) => (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-muted/90 p-2 rounded-lg mx-1 h-auto min-w-[280px] w-full"
                  >
                    <h2 className="font-semibold p-4">{column.title}</h2>
                    <div className="h-[calc(100%-60px)]">
                      {column.projects.map((project, index) => (
                        <Draggable
                          key={project.id}
                          draggableId={project.id}
                          index={index}
                        >
                          {(provided) => (
                            <TaskCard project={project} provided={provided} />
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
