import { assetUrl } from "../api";

export default function Projects({ projects, error, loading }) {
  return (
    <section id="projects" className="section">
      <h2>My <span>Projects</span></h2>
      <div className="card-container">
        {loading && <p role="status">Loading projects...</p>}
        {error && <p role="alert">Could not load projects: {error}</p>}
        {!loading && !error && projects.length === 0 && (
          <p>No projects have been added yet.</p>
        )}
        {projects.map((project) => (
          <article className="card" key={project.id}>
            {project.image && (
              <img
                className="project-image"
                src={assetUrl(project.image)}
                alt={`${project.title} project preview`}
              />
            )}
            <h3>{project.title}</h3>
            {project.description && <p>{project.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}