import "./App.scss";
import ComponentPickerRow from "./ComponentPickerRow.jsx";
import { SetVariableNode, GroupParent } from "./Nodes.jsx";
import ParameterDashboard from "./ParameterDashboard.jsx";
import { CustomBezierEdge } from "./components.jsx";

import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const PRESET_NODES = [
  {
    label: "Set Variable",
    type: "setVariableNode",
    family: "node",
  },
  {
    label: "Group Parent",
    type: "groupParent",
    family: "group",
  },
];

const nodeTypes = {
  setVariableNode: SetVariableNode,
  groupParent: GroupParent,
};

const edgeTypes = {
  customBezier: CustomBezierEdge,
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [parameters, setParameters] = useState([]);

  // The 2 functions handle changes to nodes and edges, part of ReactFlow's API
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Handle connection between nodes (gets updated at every connection change)
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "customBezier",
        data: {
          label: `Edge ${edges.length + 1}`,
          animated: true,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setNodes((nds) => {
        return nds.map((node) =>
          node.id === params.target
            ? {
                ...node,
                data: {
                  ...node.data,
                },
              }
            : node
        );
      });
    },
    [setEdges, setNodes, edges.length]
  );

  // Handle drag over to allow dropping
  const onDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Handle drop from picker
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.target.getBoundingClientRect();
      // Receive preset data and turn back into object form
      const dragData = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      // error check, data return
      if (!dragData) {
        console.log("No data received from drag transfer");
        return;
      }

      if (dragData) {
        console.log("Received drag data:", dragData);
      }

      // Destructure the drag data
      const {
        label: nodeLabel,
        type: nodeType,
        family: nodeFamily,
        id: nodeId,
      } = dragData;

      // Check if component is supposed to be on canvas
      if (!(nodeFamily === "node" || nodeFamily === "group")) {
        console.log("Not canvas placeable");
        return;
      }

      // Calculate position relative to canvas
      const nodePosition = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Check if the drop is inside a group node
      const findGroupUnderCursor = (x, y) => {
        return nodes.find((node) => {
          if (node.type !== "groupParent") return false;

          // Get the node's rendered position and size
          const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
          if (!nodeElement) return false;

          const rect = nodeElement.getBoundingClientRect();
          const canvasRect = reactFlowBounds;

          // Convert screen coordinates to canvas coordinates
          const canvasX = x + canvasRect.left;
          const canvasY = y + canvasRect.top;

          return (
            canvasX >= rect.left &&
            canvasX <= rect.right &&
            canvasY >= rect.top &&
            canvasY <= rect.bottom
          );
        });
      };

      const parentGroup = findGroupUnderCursor(
        event.clientX - reactFlowBounds.left,
        event.clientY - reactFlowBounds.top
      );

      // If dropping inside a group, let the group handle it
      if (parentGroup && nodeFamily === "node") {
        console.log(
          "Drop inside group will be handled by GroupParent component"
        );
        return;
      }

      // when dropping, the box should be placed where the pointer is
      // update the nodes state
      // check wether node or subflow (group)
      {
        nodeFamily === "node"
          ? setNodes((prev) => [
              ...prev,
              {
                id: `node-${nodeId}`,
                type: nodeType,
                position: nodePosition,
                data: {
                  label: `${nodeLabel}`,
                  parameters: parameters,
                },
              },
            ])
          : setNodes((prev) => [
              ...prev,
              {
                id: `group-${nodeId}`,
                type: nodeType,
                position: nodePosition,
                data: {
                  label: `${nodeLabel}`,
                  parameters: parameters,
                  nodes: nodes,
                  setNodes: setNodes,
                },
              },
            ]);
      }

      console.log(
        "Dropped type:",
        nodeType,
        "with label:",
        nodeLabel,
        "family:",
        nodeFamily,
        "and id:",
        nodeId
      );
    },
    [parameters, nodes]
  );

  // Functions to add and remove a new parameter to the dashboard
  const handleAddParameter = useCallback(() => {
    const newItem = {
      label: "parameter" + (parameters.length + 1),
      value: "value" + (parameters.length + 1),
      family: "variable",
      id: `${+new Date()}`,
    };

    setParameters((prev) => [...prev, newItem]);
  }, [parameters, setParameters]);

  const handleRemoveParameter = useCallback(
    (index) => {
      setParameters((prev) => prev.filter((_, i) => i !== index));
    },
    [setParameters]
  );

  // Update all nodes with new parameters whenever parameters change
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          parameters: parameters,
        },
      }))
    );
  }, [parameters]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Background color="#ccc" variant={BackgroundVariant.Cross} />
      </ReactFlow>

      <ComponentPickerRow
        PRESET_COMPONENTS={PRESET_NODES}
        title="Nodes"
        componentClassName={"node-picker"}
      />

      <ParameterDashboard
        handleAddParameter={handleAddParameter}
        handleRemoveParameter={handleRemoveParameter}
        parameters={parameters}
        setParameters={setParameters}
      />
    </div>
  );
}
