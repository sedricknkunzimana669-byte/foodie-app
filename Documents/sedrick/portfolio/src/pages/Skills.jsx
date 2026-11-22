export default function Skills({ skills, error, loading }) {
  return (
    <section id="skills" className="section">
      <h2>My <span>Skills</span></h2>
      <div className="skills-grid">
        {loading && <p role="status">Loading skills...</p>}
        {error && <p role="alert">Could not load skills: {error}</p>}
        {!loading && !error && skills.length === 0 && <p>No skills have been added yet.</p>}
        {skills.map(({ id, name, level }) => (
          <div className="skill" key={id}>
            <div className="skill-label">
              <strong>{name}</strong>
              <span>{level}%</span>
            </div>
            <div className="progress">
              <div style={{ width: `${level}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}