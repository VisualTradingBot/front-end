export { CustomBezierEdge, ButtonDelete, Box };
import { getBezierPath } from "reactflow";
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

// Custom Bezier Edge Component
function CustomBezierEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: selected ? "#ff6b6b" : "#b1b1b7",
          strokeWidth: selected ? 3 : 2,
          fill: "none",
          strokeDasharray: data?.animated ? "10,5" : "none",
          animation: data?.animated ? "dash 2s linear infinite" : "none",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      <text
        x={labelX}
        y={labelY}
        style={{
          fill: "#333",
          fontSize: "12px",
          textAnchor: "middle",
          dominantBaseline: "central",
          pointerEvents: "none",
          backgroundColor: "white",
          padding: "2px 4px",
          borderRadius: "2px",
        }}
        className="react-flow__edge-text"
      ></text>
    </>
  );
}
