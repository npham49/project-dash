"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjects } from "@/service/api-service";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";
import Image from "next/image";
export default function KanbanBoard({ projects }: { projects: Project[] }) {
  // Initial state for the Kanban board
  const initialColumns: { [key: string]: Column } = {
    idea: {
      id: "idea",
      title: "Idea 📋",
      projects:
        projects
          .filter((project) => project.status === "idea")
          .sort((a, b) => a.columnIndex - b.columnIndex) || [],
    },
    brainstorm: {
      id: "brainstorm",
      title: "Brainstorm 🤔",
      projects:
        projects
          .filter((project) => project.status === "brainstorm")
          .sort((a, b) => a.columnIndex - b.columnIndex) || [],
    },
    building: {
      id: "building",
      title: "Building 🛠️",
      projects:
        projects
          .filter((project) => project.status === "building")
          .sort((a, b) => a.columnIndex - b.columnIndex) || [],
    },
    launched: {
      id: "launched",
      title: "Launched 🚀",
      projects:
        projects
          .filter((project) => project.status === "launched")
          .sort((a, b) => a.columnIndex - b.columnIndex) || [],
    },
    afterLaunch: {
      id: "afterLaunch",
      title: "After Launch Support 🔄",
      projects:
        projects
          .filter((project) => project.status === "afterLaunch")
          .sort((a, b) => a.columnIndex - b.columnIndex) || [],
    },
  };
  const [columns, setColumns] = useState(initialColumns);
  const [changes, setChanges] = useState<Partial<Project>[]>([]);
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { getAccessTokenRaw } = useKindeBrowserClient();

  const mutation = useMutation({
    mutationFn: async (updatedProjects: Partial<Project>[]) => {
      const token = getAccessTokenRaw();
      if (!token) {
        throw new Error("Access token is null");
      }
      return updateProjects(updatedProjects, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Projects updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error(error);
      setChanges([]);
      toast({
        title: "Error",
        description: error.message || "Failed to update projects",
        variant: "destructive",
      });
    },
  });

  const debouncedUpdateProjects = useCallback(
    debounce(() => {
      if (changes.length > 0) {
        mutation.mutate(changes);
        setChanges([]);
      }
    }, 5000),
    [changes, mutation]
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newColumns = { ...columns };
    const sourceColumn = newColumns[source.droppableId];
    const [movedTask] = sourceColumn.projects.splice(source.index, 1);
    const destColumn = newColumns[destination.droppableId];
    destColumn.projects.splice(destination.index, 0, movedTask);

    // Update the project's status and columnIndex
    const updatedProject: Partial<Project> = {
      id: movedTask.id,
      status: destination.droppableId as Project["status"],
      columnIndex: destination.index,
    };

    setColumns(newColumns);
    setChanges((prevChanges) => [...prevChanges, updatedProject]);
  };

  useEffect(() => {
    debouncedUpdateProjects();
    return () => {
      debouncedUpdateProjects.cancel();
    };
  }, [changes, debouncedUpdateProjects]);

  useEffect(() => {
    setColumns(initialColumns);
  }, [projects]);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex justify-between items-center p-4 z-10">
        <div className="flex items-center space-x-2">
          <Image src="/icon.png" alt="TaskFlow Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">
            {user.firstName}, let's ideate 💡
          </h1>
        </div>
        <AddDialog
          columns={columns}
          loading={mutation.isPending}
          outOfSync={changes.length > 0}
        />
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
