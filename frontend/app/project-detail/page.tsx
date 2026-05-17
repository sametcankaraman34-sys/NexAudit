import { ProjectDetailView } from "@/modules/projects/project-detail-view";

interface ProjectDetailPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ProjectDetailPage({
  searchParams,
}: ProjectDetailPageProps) {
  const params = await searchParams;
  return <ProjectDetailView projectId={params.id} />;
}
