const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getPosts = async () => {
  const response = await fetch(`${apiUrl}/posts`);
  return response.json();
};
