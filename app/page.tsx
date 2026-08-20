import { projects } from "@/lib/site-data";

export default function Home() {
  return (
    <div className="page-stack">
      <section>
        <p className="meta">Software developer · DIG</p>
        <p className="bio">
          I build software at Directors Investment Group in Abilene, Texas.
          Recent CS graduate from Hardin-Simmons. I write about shipping small
          products and learning in public.
        </p>
      </section>

      <section className="work-block">
        <h1 className="page-title">Work</h1>
        {projects.length === 0 ? (
          <p className="empty-note">Nothing listed yet.</p>
        ) : (
          <ul className="work-list">
            {projects.map((project) => (
              <li key={project.slug} className="work-item">
                <a
                  className="item-title"
                  href={project.demoUrl ?? project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.name}
                </a>
                <p className="item-copy">{project.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
