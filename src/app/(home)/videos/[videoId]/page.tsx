import { DEFAULT_LIMIT } from "@/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface VideoPageProps {
  params: Promise<{ videoId: string }>;
}


// This is a dynamic route that will match /videos/1, /videos/2, etc.

const Page = async ({ params }: VideoPageProps) => {
    const { videoId } = await params;
  // Fetch video data using the videoId

  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetchInfinite({ videoId, limit: DEFAULT_LIMIT });


  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
