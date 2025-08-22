import { useState, useCallback } from "react";
import { ButtonDelete } from "./components.jsx";
import "./ParameterDashboard_stylesheet.scss";
import { Parameter } from "./components.jsx";

export default function ParameterDashboard({
  handleRemoveParameter,
  handleAddParameter,
  parameters,
  setParameters,
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'label' or 'value'
  const [tempValue, setTempValue] = useState("");

  const startEditing = useCallback((index, field, currentValue) => {
    setEditingIndex(index);
    setEditingField(field);
    setTempValue(currentValue);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingIndex !== null && editingField && tempValue.trim()) {
      setParameters((prev) =>
        prev.map((param, index) =>
          index === editingIndex
            ? { ...param, [editingField]: tempValue.trim() }
            : param
        )
      );
    }
    setEditingIndex(null);
    setEditingField(null);
    setTempValue("");
  }, [editingIndex, editingField, tempValue, setParameters]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditingField(null);
    setTempValue("");
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        saveEdit();
      } else if (e.key === "Escape") {
        cancelEdit();
      }
    },
    [saveEdit, cancelEdit]
  );

  return (
    <div className="parameters-dropdown">
      <span className="dropdown-title">Parameter Dashboard</span>
      <div className="dropdown-content">
        <ul>
          {parameters.map((param, index) => (
            <li key={index}>
              <span>
                {editingIndex === index && editingField === "label" ? (
                  <input
                    className="parameter-text-input"
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setTempValue("")}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => startEditing(index, "label", param.label)}
                    draggable
                    onDragStart={(event) => {
                      // Set the data to be transferred during the drag
                      const dragData: Parameter = {
                        label: param.label,
                        value: param.value,
                        family: "variable",
                        id: param.id,
                      };
                      // Send data to Node
                      event.dataTransfer.setData(
                        "application/reactflow",
                        JSON.stringify(dragData)
                      );
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                    title="Click to edit"
                  >
                    {param.label}
                  </span>
                )}
              </span>
              <span>
                {editingIndex === index && editingField === "value" ? (
                  <input
                    className="parameter-number-input"
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => startEditing(index, "value", param.value)}
                    style={{
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                    title="Click to edit"
                  >
                    {param.value}
                  </span>
                )}
                <ButtonDelete onClick={() => handleRemoveParameter(index)} />
              </span>
            </li>
          ))}
        </ul>

        <button
          className="add-parameter-btn"
          onClick={() => {
            handleAddParameter();
          }}
        >
          Add Parameter
        </button>
      </div>
    </div>
  );
}
