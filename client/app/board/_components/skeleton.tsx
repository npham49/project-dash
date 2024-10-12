import React from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  "Idea 📋",
  "Brainstorm 🤔",
  "Building 🛠️",
  "Launched 🚀",
  "After Launch Support 🔄",
];

export default function BoardSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex justify-between items-center p-4 z-10">
        <div className="flex items-center space-x-2">
          <Image src="/icon.png" alt="TaskFlow Logo" width={40} height={40} />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex-1">
        <div className="flex h-full">
          {columns.map((columnTitle, index) => (
            <div
              key={index}
              className="bg-muted/90 p-2 rounded-lg mx-1 h-auto min-w-[280px] w-full"
            >
              <h2 className="font-semibold p-4">{columnTitle}</h2>
              <div className="h-[calc(100%-60px)]">
                {[...Array(3)].map((_, cardIndex) => (
                  <div key={cardIndex} className="mb-2">
                    <Skeleton className="h-24 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
