import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  videoId: string;
  userId: string;
}

const TITLE_SYSTEM_PROMPT = `You are a video title generator. Your task is to generate a 
catchy and relevant title for a video based on its transcript. 

Please Follow These Guidelines: 
- Be concise and clear, but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspects of the video content.
- Avoid jargon or overly technical language, unless the video is intended for a specialized audience.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long, and no more than 100 characters.
- ONLY return the title as plain text, without any additional explanation or formatting.
- Do not include any hashtags, links, or references to other platforms.
- Do not include any quotations, quotation marks, annotations, or asterisks.
- Do not include any emojis or special characters.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();

    if (!text) {
      throw new Error("Transcript not found");
    }

    return text;
  });

  const { body } = await context.api.openai.call("Generate Title", {
    token: process.env.OPENAI_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    },
  });

  const title = body.choices[0]?.message.content;

  if (!title) {
    throw new Error("Title not found");
  }

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ title: title || video.title })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
