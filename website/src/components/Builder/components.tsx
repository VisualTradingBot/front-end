export { ButtonDelete, Box, Parameter, PresetNode, NewBlock };
import "./components.scss"; // Import styles

// Boxes go inside interactive nodes drop zone
function Box({ data }) {
  return (
    <span>
      <h3>{data.label}</h3>
    </span>
  );
}

// Default x delete button
function ButtonDelete({ onClick }) {
  return (
    <button className="remove-btn" onClick={onClick}>
      ×
    </button>
  );
}

interface Parameter {
  label: string;
  value: string;
  family: string;
  id: string;
}

interface PresetNode {
  label: string;
  type: string;
  family: string;
  id?: string;
}

interface NewBlock {
  placedId: string;
  label: string;
  zoneId: string;
  value: number;
  family: string;
  parameterId: string;
}
