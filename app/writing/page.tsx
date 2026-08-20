import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes and longer-form writing by Stephen Lajuwomi.",
};

function formatDate(value: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <div className="page-stack">
      <section>
        <h1 className="page-title">Writing</h1>
        <p className="lede">
          Short pieces on shipping software and staying in control of the work.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="empty-note">Nothing published yet.</p>
      ) : (
        <ol className="writing-list">
          {posts.map((post) => (
            <li key={post.slug} className="writing-item">
              <Link href={`/writing/${post.slug}`}>
                {post.date ? <div className="meta">{formatDate(post.date)}</div> : null}
                <div className="item-title">{post.title}</div>
                {post.description ? (
                  <p className="item-excerpt">{post.description}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
