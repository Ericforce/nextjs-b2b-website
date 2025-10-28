import { BlogCard } from "./blog-card";
import type { BlogPostPreview } from "@/types/sanity";

interface BlogGridProps {
  posts: BlogPostPreview[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (!posts || posts.length === 0) {
    return <p className="blog-grid__empty">No posts available yet. Please check back soon.</p>;
  }

  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
