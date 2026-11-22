import ResourceManager from "./ResourceManager";

const fields = [
  { name: "title", label: "Service name", type: "text", required: true, maxLength: 200 },
  { name: "description", label: "Description", type: "textarea", maxLength: 5000 },
];

export default function ManageServices() {
  return <ResourceManager endpoint="/services" title="Services" itemLabel="Service" fields={fields} />;
}