import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/writing";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose">
      <header className="mb-8">
        <h1>{post.title}</h1>
        {post.date ? (
          <time className="text-sm text-stone-500">{post.date}</time>
        ) : null}
      </header>
      {/* MDX stays server-rendered and can be extended with safe components later. */}
      <MDXRemote source={post.content} />
    </article>
  );
}
