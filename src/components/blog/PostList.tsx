import { PostCard } from "@/components/blog/PostCard";
import { cn } from "@/lib/utils";
import type { BlogPostDocument } from "@/types";

export interface PostListProps {
  posts: BlogPostDocument[];
  className?: string;
}

export function PostList({ posts, className }: PostListProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-8 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {posts.map((post) => (
        <PostCard key={post._id ?? post.slug} post={post} />
      ))}
    </div>
  );
}
