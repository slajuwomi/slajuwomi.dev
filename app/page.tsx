import Image from "next/image";
import {
  currentRole,
  education,
  previousRoles,
  projects,
} from "@/lib/site-data";

export default function Home() {
  return (
    <div className="page-stack">
      <h1 className="sr-only">About Stephen Lajuwomi</h1>

      <ul className="fact-list">
        <li className="fact-row">
          <span className="fact-mark" aria-hidden="true" />
          <div className="fact-body">
            <span>{currentRole.role}</span>
            <Image
              src={currentRole.logo}
              alt=""
              width={22}
              height={22}
              className="fact-logo"
            />
            <a
              className="fact-link"
              href={currentRole.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentRole.company}
            </a>
          </div>
        </li>
        <li className="fact-row">
          <span className="fact-mark" aria-hidden="true" />
          <div className="fact-body">
            <span>{education.degree}</span>
            <Image
              src={education.logo}
              alt=""
              width={22}
              height={22}
              className="fact-logo"
            />
            <a
              className="fact-link"
              href={education.schoolUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {education.school}
            </a>
            <span className="fact-year">({education.year})</span>
          </div>
        </li>
      </ul>

      <section className="work-block">
        <h2 className="page-title">Projects</h2>
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

      <section className="work-block">
        <h2 className="page-title">Previously</h2>
        <ul className="work-list">
          {previousRoles.map((item) => (
            <li key={`${item.company}-${item.role}`} className="work-item">
              <p className="item-title">
                {item.role}{" "}
                <span className="item-copy">at {item.company}</span>
              </p>
              <p className="meta">{item.dates}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
