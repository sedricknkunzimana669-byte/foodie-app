import ResourceManager from "./ResourceManager";

const fields = [
  { name: "title", label: "Project title", type: "text", required: true, maxLength: 200 },
  { name: "description", label: "Description", type: "textarea", maxLength: 5000 },
  { name: "image", label: "Project image", type: "image", maxLength: 2048 },
];

export default function ManageProjects() {
  return <ResourceManager endpoint="/projects" title="Projects" itemLabel="Project" fields={fields} />;
}