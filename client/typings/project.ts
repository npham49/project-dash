import { Option } from "@/components/ui/multiple-selector";
import { z } from "zod";

// Define the structure of a task
export interface Project {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  interest: "low" | "medium" | "high";
  labels: Option[];
}

// Define the structure of a column
export interface Column {
  id: string;
  title: string;
  projects: Project[];
}

export const projectSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  interest: z.enum(["low", "medium", "high"]),
  labels: z.array(z.object({ label: z.string(), value: z.string() })),
});
