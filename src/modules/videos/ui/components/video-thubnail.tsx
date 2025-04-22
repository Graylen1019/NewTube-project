import { formatDuration } from "@/lib/utils";
import Image from "next/image";

interface VideoThumbnailProps {
  title: string;
  duration?: number;
  imageUrl?: string | null;
  previewUrl?: string | null;
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      {/* THumbnail wrapper */}
      <div className="realtive w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? "/placeholder.svg"}
          alt={title}
          layout="fill"
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl ?? "/placeholder.svg"}
          alt={title}
          layout="fill"
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      {/* Video Duration box */}
      <div className="absolute bottom-2 right-2 px-1 py-0 5 rounded bg-black/55 text-white text-xs font-medium">
        {formatDuration(duration || 0)}
      </div>
    </div>
  );
};
