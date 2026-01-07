export type ProjectDTO = {
  id: string;
  title: string;
  description?: string;
  client?: string;
  year?: string;
  createdAt?: string;
  imageUrls: string[];
};

export async function getAllProjects(): Promise<ProjectDTO[]> {
  const res = await fetch("/make-server-be0083bc/projects");
  if (!res.ok) throw new Error("Failed fetching projects");
  const body = await res.json();
  return body.projects || [];
}