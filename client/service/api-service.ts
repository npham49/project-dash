const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const getPosts = async () => {
  const response = await fetch(`${apiUrl}/posts`);
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
