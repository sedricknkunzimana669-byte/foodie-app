import ResourceManager from "./ResourceManager";

const fields = [
  { name: "name", label: "Skill", type: "text", required: true, maxLength: 100 },
  { name: "level", label: "Proficiency (0-100)", type: "number", required: true, min: 0, max: 100 },
];

export default function ManageSkills() {
  return <ResourceManager endpoint="/skills" title="Skills" itemLabel="Skill" fields={fields} />;
}