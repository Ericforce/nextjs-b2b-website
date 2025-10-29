import type { BlogPostSummary } from "@/types/blog";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  posts?: BlogPostSummary[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-secondary-900">
          Related posts
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
