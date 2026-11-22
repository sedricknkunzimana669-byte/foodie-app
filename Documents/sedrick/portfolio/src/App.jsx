
import { useEffect, useState } from "react";
import Navbar from "./frontend/Navbar";
import Footer from "./frontend/Footer";
import AdminApp from "./admin/AdminApp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Education from "./pages/Education";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Skills from "./pages/Skills";
import { apiRequest } from "./api";
import "./App.css";

const defaultProfile = {
  name: "Sedrick Nkuzimana",
  profession: "Web Developer",
  email: "sedricknkunzimana200@email.com",
  location: "Rwanda",
  bio: "I am a passionate web developer interested in designing and developing websites and applications. I enjoy learning new technologies and solving problems.",
  photo_url: "",
};

function PortfolioApp() {
  const [profile, setProfile] = useState(defaultProfile);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentErrors, setContentErrors] = useState({});
  const [contactStatus, setContactStatus] = useState({ type: "", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      apiRequest("/profile"),
      apiRequest("/education"),
      apiRequest("/skills"),
      apiRequest("/projects"),
      apiRequest("/services"),
    ]).then(([profileResult, educationResult, skillsResult, projectsResult, servicesResult]) => {
      if (!active) return;
      const results = [
        ["profile", profileResult, setProfile],
        ["education", educationResult, setEducation],
        ["skills", skillsResult, setSkills],
        ["projects", projectsResult, setProjects],
        ["services", servicesResult, setServices],
      ];
      const errors = {};
      for (const [name, result, setter] of results) {
        if (result.status === "fulfilled") {
          if (result.value) setter(result.value);
        } else {
          errors[name] = result.reason.message;
        }
      }
      setContentErrors(errors);
      setContentLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleContactSubmit(event) {
    event.preventDefault();
    setContactSubmitting(true);
    setContactStatus({ type: "", message: "" });

    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;

    try {
      const result = await apiRequest("/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      form.reset();
      setContactStatus({ type: "success", message: result.message });
    } catch (error) {
      setContactStatus({ type: "error", message: error.message });
    } finally {
      setContactSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <Home profile={profile} />
      <About profile={profile} error={contentErrors.profile} />
      <Education
        education={education}
        error={contentErrors.education}
        loading={contentLoading}
      />
      <Skills skills={skills} error={contentErrors.skills} loading={contentLoading} />
      <Projects
        projects={projects}
        error={contentErrors.projects}
        loading={contentLoading}
      />
      <Services
        services={services}
        error={contentErrors.services}
        loading={contentLoading}
      />
      <Contact
        onSubmit={handleContactSubmit}
        status={contactStatus}
        submitting={contactSubmitting}
      />
      <Footer />
    </>
  );
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/login") return <Login />;
  return pathname.startsWith("/admin") ? <AdminApp /> : <PortfolioApp />;
}

export default App;
