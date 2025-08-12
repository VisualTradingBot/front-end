import "./Nodes_stylesheet.scss";
import { useMemo, useState, useCallback, useEffect, Children } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { ButtonDelete, Box } from "./components.jsx";
export { SetVariableNode, GroupParent };

const ZONE_COMPATIBILITY = {
  variable: {
    allowedFamilies: ["variable"],
  },
};

function SetVariableNode({ data, selected }) {
  const parameters = useMemo(() => data?.parameters || [], [data?.parameters]);
  const [blocks, setBlocks] = useState([]);
  const [dragOverZone, setDragOverZone] = useState(null);
  const [isValidDrop, setIsValidDrop] = useState(true);
  const [variableNum, setVariableNum] = useState(1);
  const [minHeightResizeBox, setMinHeightResizeBox] = useState(124);

  // Check if a component is compatible with a drop zone
  const isCompatible = useCallback((componentFamily, zoneId) => {
    console.log(
      `Checking compatibility for ${componentFamily} in zone ${zoneId}`
    );
    // Define compatibility rules - handle dynamic variable zones
    const baseZoneType = zoneId.startsWith("variable-") ? "variable" : zoneId;
    const zoneRules = ZONE_COMPATIBILITY[baseZoneType];
    if (!zoneRules) {
      console.log(`Incompatible`);
      return false;
    }

    // Check by component family
    if (zoneRules.allowedFamilies.includes(componentFamily)) {
      console.log(
        `Compatible drop: ${componentFamily} can be placed in ${zoneId} zone`
      );
      return true;
    }

    return false;
  }, []);

  const handleBlockDrop = useCallback(
    (event, zoneId) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent ReactFlow from handling this drop

      // Get the block (parameter) data from the event Parameter Dashboard
      const blockData = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      if (!blockData) return;

      const {
        label: paramLabel,
        value: paramValue,
        family: paramFamily,
        id: paramId,
      } = blockData;

      // Final compatibility check before dropping
      if (!isCompatible(paramFamily, zoneId)) {
        console.log(
          `Incompatible drop: ${paramFamily} cannot be placed in ${zoneId} zone`
        );
        setDragOverZone(null);
        setIsValidDrop(true);
        return; // Reject the drop
      }

      // If already exists, do not add again
      if (blocks.some((b) => b.zoneId === zoneId && b.label === paramLabel)) {
        console.log(`Block ${paramLabel} already exists`);
        setDragOverZone(null);
        setIsValidDrop(true);
        return; // Reject the drop
      }

      // Create a new block object
      const newBlock = {
        id: `block-${Date.now()}`,
        label: paramLabel,
        zoneId: zoneId,
        value: paramValue,
        family: paramFamily,
        parameterId: paramId, // Store parameter ID for tracking
      };

      setBlocks((prev) => [
        ...prev.filter((b) => b.zoneId !== zoneId),
        newBlock,
      ]);
      setDragOverZone(null);
      setIsValidDrop(true);
    },
    [isCompatible, blocks]
  );

  const handleDragOver = useCallback((event, zoneId) => {
    event.preventDefault();
    event.stopPropagation();

    // Check if there's any drag data available
    if (event.dataTransfer.types.includes("application/reactflow")) {
      setDragOverZone(zoneId);
      setIsValidDrop(true);
      // We'll validate compatibility during the drop event
      // Assume valid for visual feedback
    } else {
      setDragOverZone(null);
      setIsValidDrop(false);
    }
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    // Only clear if we're leaving the entire drop zone area
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDragOverZone(null);
    }
  }, []);

  const removeBlock = (blockId) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const removeVariable = (variableIndex) => {
    setBlocks((prev) =>
      prev.filter((b) => !b.zoneId.startsWith(`variable-${variableIndex}`))
    );
    setVariableNum((prev) => Math.max(prev - 1, 1));
  };

  const addVariable = () => {
    setVariableNum((prev) => prev + 1);
    setMinHeightResizeBox(124 + 54 * (variableNum - 1));
    console.log("Min height resize box:");
  };

  // Clean up blocks when parameters are deleted and update labels when changed
  useEffect(() => {
    if (parameters) {
      const parameterMap = new Map(parameters.map((p) => [p.id, p]));

      setBlocks((prev) =>
        prev
          .filter((block) => {
            // Keep non-variable blocks or blocks whose parameter still exists
            return (
              block.family !== "variable" || parameterMap.has(block.parameterId)
            );
          })
          .map((block) => {
            // Update labels for variable blocks if parameter label changed
            if (
              block.family === "variable" &&
              parameterMap.has(block.parameterId)
            ) {
              const parameter = parameterMap.get(block.parameterId);
              return {
                ...block,
                label: parameter.label,
                value: parameter.value,
                parameterLabel: parameter.label,
              };
            }
            return block;
          })
      );
    }
  }, [parameters]);

  return (
    <>
      <NodeResizer
        key={`resizer-${variableNum}`}
        minWidth={280}
        minHeight={minHeightResizeBox}
        color="#ff0071"
        isVisible={selected}
      />
      <div className="logic-node" style={{}}>
        <div className="node-title">
          <h3>{data?.label || "Interactive Node"}</h3>
        </div>
        <div className="bellow-title">
          <div className="main-contents">
            {Children.toArray(
              Array.from({ length: variableNum }, (_, index) => {
                const variableIndex = index + 1;
                const zoneId = `variable-${variableIndex}`;
                return (
                  <div className="drop-zones-container" key={zoneId}>
                    <div className="drop-zone-row">
                      <div className="left-connections">
                        <Handle
                          type="target"
                          position={Position.Left}
                          id={"left" + variableIndex}
                        ></Handle>
                      </div>
                      <div>
                        <ButtonDelete
                          onClick={() => removeVariable(variableIndex)}
                        />
                        <span className="zone-label">
                          variable {variableIndex}:
                        </span>
                        <div
                          className={`drop-zone ${
                            dragOverZone === zoneId
                              ? isValidDrop
                                ? "drag-over"
                                : "drag-over-invalid"
                              : ""
                          }`}
                          // Handle drop for boxes that are variables
                          // It's meant to take the variable and also send
                          // the data family it accepts
                          onDrop={(e) => handleBlockDrop(e, zoneId)}
                          onDragOver={(e) => handleDragOver(e, zoneId)}
                          onDragLeave={handleDragLeave}
                        >
                          {blocks.find((b) => b.zoneId === zoneId) ? (
                            <div className="placed-block">
                              <Box
                                data={blocks.find((b) => b.zoneId === zoneId)}
                              />
                              <ButtonDelete
                                onClick={() =>
                                  removeBlock(
                                    blocks.find((b) => b.zoneId === zoneId).id
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div className="empty-zone"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="bottom-add-btn">
            <button className="add-block-btn" onClick={addVariable}>
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function GroupParent({ data, selected, id }) {
  const [dragOver, setDragOver] = useState(false);

  const parameters = useMemo(() => data?.parameters || [], [data?.parameters]);
  const nodes = useMemo(() => data?.nodes || [], [data?.nodes]);
  const setNodes = data?.setNodes;

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    // Check if the dragged item is a node
    if (event.dataTransfer.types.includes("application/reactflow")) {
      setDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    // Only clear if we're leaving the group entirely
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOver(false);

      // Get the dragged node data
      const dragData = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      if (!dragData) return;

      const {
        label: nodeLabel,
        type: nodeType,
        family: nodeFamily,
        id: nodeId,
      } = dragData;

      // Only allow nodes (not groups) to be dropped inside
      if (nodeFamily === "node") {
        console.log(`Node dropped into group ${id}:`, dragData);

        // Get the group element to calculate relative position
        const groupElement = document.querySelector(`[data-id="${id}"]`);
        if (!groupElement) return;

        const groupRect = groupElement.getBoundingClientRect();

        // Calculate position relative to the group's content area
        const relativePosition = {
          x: event.clientX - groupRect.left - 10, // Small offset from group border
          y: event.clientY - groupRect.top - 40, // Offset to account for group header
        };

        // Create the new node inside this group
        setNodes((prev) => [
          ...prev,
          {
            id: `node-${nodeId}`,
            type: nodeType,
            position: relativePosition,
            parentId: id,
            extent: "parent",
            data: {
              label: `${nodeLabel}`,
              parameters: parameters,
            },
          },
        ]);

        console.log(
          `Created node ${nodeType} with label ${nodeLabel} inside group ${id} at position:`,
          relativePosition
        );
      }
    },
    [id, setNodes, parameters]
  );

  // Get child nodes that belong to this group
  const childNodes = nodes.filter((node) => node.parentId === id);

  return (
    <>
      <NodeResizer
        minWidth={300}
        minHeight={200}
        color="#3b82f6"
        isVisible={selected}
      />
      <div
        className={`group-parent ${dragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: dragOver ? "2px dashed #3b82f6" : "2px solid #e5e7eb",
          backgroundColor: dragOver
            ? "rgba(59, 130, 246, 0.1)"
            : "rgba(249, 250, 251, 0.8)",
          position: "relative",
        }}
      >
        <div className="group-inside">
          <div className="group-header">{data?.label || "Subflow Group"}</div>

          <div className="group-content">
            {childNodes.length > 0 && (
              <div className="child-nodes-info">
                <small>
                  Contains {childNodes.length} node
                  {childNodes.length !== 1 ? "s" : ""}
                </small>
              </div>
            )}
            {dragOver && (
              <div className="drop-hint">
                Drop node here to add it to this group
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
