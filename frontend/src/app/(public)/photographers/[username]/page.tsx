import { PublicProfilePage } from "@/features/public-profile/PublicProfilePage";

export default async function PhotographerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <PublicProfilePage username={username} />;
}
