// Define the structure of a task
export interface Task {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  interest: "low" | "medium" | "high";
  labels: string[];
}

// Define the structure of a column
export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
