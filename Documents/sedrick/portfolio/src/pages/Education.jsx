export default function Education({ education, error, loading }) {
  return (
    <section id="education" className="section">
      <h2>My <span>Education</span></h2>
      <div className="card-container">
        {loading && <p role="status">Loading education...</p>}
        {error && <p role="alert">Could not load education: {error}</p>}
        {!loading && !error && education.length === 0 && (
          <p>No education details have been added yet.</p>
        )}
        {education.map((item) => (
          <article className="card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.institution}</p>
            {item.field && <p>Field: {item.field}</p>}
            {(item.start_year || item.end_year) && (
              <p>Year: {item.start_year || "-"} - {item.end_year || "Present"}</p>
            )}
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}