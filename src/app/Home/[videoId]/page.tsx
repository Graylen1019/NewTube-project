
interface PageProps {
  params: Promise<{ videosId: string }>;
}

const Page = async ({ params }: PageProps) => {

  console.log('server comp')

  const { videoId } = await params;

  return <div>Videos Id: {videoId} </div>;
};

export default Page;
