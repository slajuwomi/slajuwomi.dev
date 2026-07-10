import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/productivity",
        destination: "https://productivity.slajuwomi.dev/",
        permanent: true,
      },
      {
        source: "/productivity/habits",
        destination: "https://productivity.slajuwomi.dev/habits",
        permanent: true,
      },
      {
        source: "/productivity/habits/manage",
        destination: "https://productivity.slajuwomi.dev/habits/manage",
        permanent: true,
      },
      {
        source: "/productivity/habits/overview",
        destination: "https://productivity.slajuwomi.dev/habits/overview",
        permanent: true,
      },
      {
        source: "/productivity/leetcode",
        destination: "https://productivity.slajuwomi.dev/leetcode",
        permanent: true,
      },
      {
        source: "/productivity/leetcode/:id",
        destination: "https://productivity.slajuwomi.dev/leetcode/:id",
        permanent: true,
      },
      {
        source: "/productivity/yearly-leetcode",
        destination: "https://productivity.slajuwomi.dev/yearly-leetcode",
        permanent: true,
      },
      {
        source: "/productivity/motivation",
        destination: "https://productivity.slajuwomi.dev/motivation",
        permanent: true,
      },
      {
        source: "/productivity/vision",
        destination: "https://productivity.slajuwomi.dev/vision",
        permanent: true,
      },
      {
        source: "/productivity/finances/student-loan-consolidation",
        destination:
          "https://productivity.slajuwomi.dev/finances/student-loan-consolidation",
        permanent: true,
      },
      {
        // Keep unknown legacy paths useful after the explicit promoted routes above.
        source: "/productivity/:path*",
        destination: "https://productivity.slajuwomi.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
