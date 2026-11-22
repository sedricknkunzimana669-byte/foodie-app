export default function Services({ services, error, loading }) {
  return (
    <section id="services" className="section">
      <h2>My <span>Services</span></h2>
      <div className="card-container">
        {loading && <p role="status">Loading services...</p>}
        {error && <p role="alert">Could not load services: {error}</p>}
        {!loading && !error && services.length === 0 && (
          <p>No services have been added yet.</p>
        )}
        {services.map((service) => (
          <article className="card" key={service.id}>
            <h3>{service.title}</h3>
            {service.description && <p>{service.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}