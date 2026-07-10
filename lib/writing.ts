import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const writingDirectory = path.join(process.cwd(), "content", "writing");

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description?: string;
};

export type Post = PostSummary & {
  content: string;
};

function getMdxFilenames() {
  if (!fs.existsSync(writingDirectory)) {
    return [];
  }

  return fs
    .readdirSync(writingDirectory)
    .filter((filename) => filename.endsWith(".mdx"));
}

export function getAllPosts(): PostSummary[] {
  return getMdxFilenames()
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const source = fs.readFileSync(path.join(writingDirectory, filename), "utf8");
      const { data } = matter(source);

      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        description: data.description ? String(data.description) : undefined,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | null {
  // Reject path-like slugs before joining them to the content directory.
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return null;
  }

  const filename = path.join(writingDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filename)) {
    return null;
  }

  const source = fs.readFileSync(filename, "utf8");
  const { data, content } = matter(source);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: data.description ? String(data.description) : undefined,
    content,
  };
}
