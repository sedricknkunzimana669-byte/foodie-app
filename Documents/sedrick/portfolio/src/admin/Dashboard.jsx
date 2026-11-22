import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import ManageEducation from "./ManageEducation";
import ManageMessages from "./ManageMessages";
import ManageProfile from "./ManageProfile";
import ManageProjects from "./ManageProjects";
import ManageServices from "./ManageServices";
import ManageSkills from "./ManageSkills";
import "./admin.css";

const sections = [
  ["overview", "Overview"],
  ["profile", "Profile"],
  ["education", "Education"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["services", "Services"],
  ["messages", "Messages"],
];

const quickActions = [
  {
    id: "projects",
    title: "Add a project",
    description: "Share a project and upload its preview image.",
    label: "Add project",
  },
  {
    id: "profile",
    title: "Update your profile",
    description: "Refresh your introduction, contact details, and profile photo.",
    label: "Edit profile",
  },
  {
    id: "skills",
    title: "Add a skill",
    description: "Show visitors what you do and your proficiency.",
    label: "Manage skills",
  },
  {
    id: "education",
    title: "Add education",
    description: "Keep your education and experience up to date.",
    label: "Manage education",
  },
  {
    id: "services",
    title: "Add a service",
    description: "Tell visitors what work you are available for.",
    label: "Manage services",
  },
];

export default function Dashboard({ email, onLogout }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [counts, setCounts] = useState(null);
  const [countsError, setCountsError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest("/projects"),
      apiRequest("/education"),
      apiRequest("/skills"),
      apiRequest("/services"),
      apiRequest("/messages"),
    ])
      .then(([projects, education, skills, services, messages]) => {
        if (active) {
          setCounts({
            Projects: projects.length,
            Education: education.length,
            Skills: skills.length,
            Services: services.length,
            Messages: messages.length,
          });
        }
      })
      .catch((error) => {
        if (active) setCountsError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      onLogout();
    } catch (error) {
      setCountsError(error.message);
      setLoggingOut(false);
    }
  }

  function renderSection() {
    switch (activeSection) {
      case "profile": return <ManageProfile />;
      case "education": return <ManageEducation />;
      case "skills": return <ManageSkills />;
      case "projects": return <ManageProjects />;
      case "services": return <ManageServices />;
      case "messages": return <ManageMessages />;
      default:
        return (
          <section className="admin-section">
            <header className="admin-dashboard-welcome">
              <div>
                <p className="admin-eyebrow">Portfolio workspace</p>
                <h1>Welcome back</h1>
                <p className="admin-overview-copy">
                  Add projects, upload images, and keep your portfolio up to date.
                </p>
              </div>
              <button
                className="admin-button"
                type="button"
                onClick={() => setActiveSection("projects")}
              >
                + Add a project
              </button>
            </header>

            {!counts && !countsError && <p role="status">Loading dashboard...</p>}
            {counts && (
              <section className="admin-dashboard-stats" aria-label="Portfolio content totals">
                <h2>Your content</h2>
                <div className="admin-count-grid">
                  {Object.entries(counts).map(([label, count]) => (
                    <article className="admin-panel admin-count-card" key={label}>
                      <span>{label}</span>
                      <strong>{count}</strong>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="admin-quick-actions" aria-labelledby="admin-quick-actions-title">
              <div className="admin-quick-actions-heading">
                <div>
                  <p className="admin-eyebrow">Get started</p>
                  <h2 id="admin-quick-actions-title">What would you like to update?</h2>
                </div>
                <p>Changes appear on your public portfolio after you save.</p>
              </div>
              <div className="admin-quick-action-grid">
                {quickActions.map((action) => (
                  <article className="admin-panel admin-quick-action" key={action.id}>
                    <div>
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </div>
                    <button
                      className="admin-button admin-button-muted"
                      type="button"
                      onClick={() => setActiveSection(action.id)}
                    >
                      {action.label}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        );
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand">Portfolio Admin</a>
        <p className="admin-user">{email}</p>
        <nav aria-label="Admin sections">
          {sections.map(([id, label]) => (
            <button
              className={activeSection === id ? "admin-nav-link active" : "admin-nav-link"}
              type="button"
              key={id}
              onClick={() => setActiveSection(id)}
              aria-current={activeSection === id ? "page" : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
        <p className="admin-sidebar-hint">Update your portfolio content here. Saved changes appear on your website.</p>
        <button
          className="admin-button admin-logout"
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <a href="/" className="admin-back-link">View portfolio</a>
        </header>
        {countsError && <p className="admin-alert admin-dashboard-alert" role="alert">{countsError}</p>}
        {renderSection()}
      </main>
    </div>
  );
}