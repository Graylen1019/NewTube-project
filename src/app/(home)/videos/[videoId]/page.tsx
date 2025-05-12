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
  // You can use the videoId to fetch data from your API or database
  void trpc.comments.getMany.prefetch({ videoId: videoId });
  // TODO: Dont forget to change to prefetch infinite


  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
