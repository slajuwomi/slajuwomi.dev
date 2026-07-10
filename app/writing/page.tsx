import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes and longer-form writing by Stephen Lajuwomi.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-stone-800 dark:text-stone-200">
          writing
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          notes on software, learning, and the work in between.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 px-5 py-10 text-center dark:border-stone-700">
          <p className="font-medium text-stone-700 dark:text-stone-300">
            nothing published yet.
          </p>
          <p className="mt-1 text-sm text-stone-500">
            posts will show up here when they are ready.
          </p>
        </div>
      ) : (
        <ol className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                className="group flex items-baseline gap-4 rounded-md py-1 transition-transform hover:translate-x-1"
              >
                <span className="font-medium text-stone-800 group-hover:underline group-hover:underline-offset-4 dark:text-stone-200">
                  {post.title}
                </span>
                <time className="ml-auto shrink-0 text-xs text-stone-500">
                  {post.date}
                </time>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
