export default function About({ profile, error }) {
  return (
    <section id="about" className="section">
      <h2>About <span>Me</span></h2>
      <p>{profile.bio}</p>
      <div className="info">
        {error && <p role="alert">Could not load profile: {error}</p>}
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Profession:</strong> {profile.profession}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Location:</strong> {profile.location}</p>
      </div>
    </section>
  );
}