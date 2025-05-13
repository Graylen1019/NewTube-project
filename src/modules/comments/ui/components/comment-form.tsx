import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply";
}

export const CommentForm = ({
  videoId,
  parentId,
  onSuccess,
  onCancel,
  variant = "comment",
}: CommentFormProps) => {
  const clerk = useClerk();
  const { user } = useUser();

  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success("Comment added!");
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Something Went Wrong!");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true }) as never),
    defaultValues: {
      parentId,
      videoId,
      value: "",
    },
  });

  const handleSubmit = (value: z.infer<typeof commentInsertSchema>) => {
    create.mutate(value);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  }

  return (
    <Form {...form}>
      <form
        className="flex gap-4 group"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.username || "User"}
        />
        <div className="flex-1">
          <div className="flex-1">
            <FormField
              name="value"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={
                        variant === "reply"
                          ? "Reply to this comment..."
                          : "Add a comment..."
                      }
                      className="resize-none bg-transparent overflow-hidden min-h-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <div className="justify-end gap-2 mt-2 flex">
              {onCancel && (
                <Button variant="ghost" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" size="sm" disabled={create.isPending}>
                {variant === "reply" ? "reply" : "comment"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
