import { Project } from "@/typings/project";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const getPosts = async () => {
  const response = await fetch(`${apiUrl}/posts`);
  return response.json();
};

export const createProject = async (
  project: Partial<Project>,
  token: string
): Promise<Project> => {
  try {
    const response = await fetch(`${apiUrl}/project`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error; // Re-throw the error so it can be handled by the mutation
  }
};

export const getProjects = async (token: string) => {
  const response = await fetch(`${apiUrl}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const updateProject = async (
  id: string,
  project: Partial<Project>,
  token: string
) => {
  const response = await fetch(`${apiUrl}/project/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
  return response.json();
};

export const getUser = async (token: string) => {
  const response = await fetch(`${apiUrl}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updateProjects = async (
  projects: Partial<Project>[],
  token: string
): Promise<Project[]> => {
  try {
    const response = await fetch(`${apiUrl}/projects/batch`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projects),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating projects:", error);
    throw error;
  }
};
