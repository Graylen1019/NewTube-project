import { categoriesRouter } from "@/modules/categories/server/procedures";

import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { VideoViewsRouter } from "@/modules/video-views/server/procedures";
import { VideoReactionsRouter } from "@/modules/video-reactions/server/procedures";
import { SubscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoriesRouter,
  videos: videosRouter,
  videoViews: VideoViewsRouter,
  videoReactions: VideoReactionsRouter,
  subscriptions: SubscriptionsRouter,
  comments: commentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
