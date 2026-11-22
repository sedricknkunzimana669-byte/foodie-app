import { assetUrl } from "../api";

export default function Home({ profile }) {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <p className="welcome">WELCOME TO MY PORTFOLIO</p>
        <h1>Hello, I'm <span>{profile.name}</span></h1>
        <h2>I'm a {profile.profession}</h2>
        <p>
          I create modern, responsive and user-friendly websites using modern
          web technologies.
        </p>
        <a href="#projects" className="btn">View My Projects</a>
        <a href="#contact" className="btn secondary">Contact Me</a>
      </div>
      <div className="profile">
        <img
          src={assetUrl(profile.photo_url) || "https://placehold.co/350x350?text=Your+Photo"}
          alt={`${profile.name} profile`}
        />
      </div>
    </section>
  );
}