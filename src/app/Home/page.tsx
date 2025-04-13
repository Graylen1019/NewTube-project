const Page = () => {
  console.log("where am i rendered");

  const data = db.select().from(videos).where(eq(videos.id, "123"));
  return <div>Feed Page!</div>;
};

export default Page;
