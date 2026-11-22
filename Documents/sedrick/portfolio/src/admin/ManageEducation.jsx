import ResourceManager from "./ResourceManager";

const fields = [
  { name: "title", label: "Qualification", type: "text", required: true, maxLength: 200 },
  { name: "institution", label: "Institution", type: "text", required: true, maxLength: 200 },
  { name: "field", label: "Field of study", type: "text", maxLength: 200 },
  { name: "start_year", label: "Start year", type: "number", min: 1901, max: 2155 },
  { name: "end_year", label: "End year", type: "number", min: 1901, max: 2155 },
  { name: "description", label: "Description", type: "textarea", maxLength: 5000 },
];

export default function ManageEducation() {
  return <ResourceManager endpoint="/education" title="Education" itemLabel="Education entry" fields={fields} />;
}