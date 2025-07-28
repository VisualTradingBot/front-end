import "./App.scss";
import { useCallback, useState, useRef, useEffect } from "react";
import { Box, ComponentPicker } from "./components.jsx"; // Import components
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const PRESET_NODES_ACTIONS = [
  { type: "inputBox", label: "Input" },
  { type: "whileBox", label: "While" },
  { type: "notifyBox", label: "Notify" },
  { type: "executeBox", label: "Execute" },
  { type: "ifBox", label: "If" },
  // Add more presets here if needed
];

const PRESET_NODES_SOMETHING = [
  { type: "somethingBox", label: "Input Something" },
];

const nodeTypes = {
  inputBox: Box,
  whileBox: Box,
  notifyBox: Box,
  executeBox: Box,
  ifBox: Box,
  somethingBox: Box,
}; // Register Box as a node type

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const edgesRef = useRef(edges);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const onMessageChange = useCallback((id, message) => {
    setNodes((nds) => {
      // Use the latest edges from ref
      const outgoing = edgesRef.current.filter((e) => e.source === id);

      let updatedNodes = nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                message,
                onMessageChange,
              },
            }
          : node
      );

      if (outgoing.length > 0) {
        updatedNodes = updatedNodes.map((node) => {
          const isTarget = outgoing.some((e) => e.target === node.id);
          if (isTarget) {
            return {
              ...node,
              data: {
                ...node.data,
                receivedMessage: message || "No message",
                onMessageChange,
              },
            };
          }
          return node;
        });
      }

      return updatedNodes;
    });
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      setNodes((nds) => {
        const sourceNode = nds.find((n) => n.id === params.source);
        return nds.map((node) =>
          node.id === params.target
            ? {
                ...node,
                data: {
                  ...node.data,
                  receivedMessage: sourceNode?.data?.message || "No message",
                  onMessageChange, // keep function reference
                },
              }
            : node
        );
      });
    },
    [setEdges, setNodes, onMessageChange]
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
      const data = event.dataTransfer.getData("application/reactflow");
      const [type, label] = data.split(",");
      if (!type) return;

      // Calculate position relative to canvas
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      console.log("Dropped type:", type, "at position:", position);

      // when dropping, the box should be placed where the pointer is
      setNodes((nds) => [
        ...nds,
        {
          id: `${+new Date()}`,
          type: type,
          position: position,
          data: {
            label: `${label}`,
            onMessageChange, // add function reference
          },
        },
      ]);
    },
    [setNodes, onMessageChange]
  );

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        minZoom={0.1}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Background color="#ccc" variant={BackgroundVariant.Cross} />
      </ReactFlow>

      <div className="box-picker">
        <ComponentPicker
          PRESET_NODES={PRESET_NODES_ACTIONS}
          title="Actions"
          nameComponentClass={"action-picker"}
        />
        <ComponentPicker
          PRESET_NODES={PRESET_NODES_SOMETHING}
          title="Something"
          nameComponentClass={"something-picker"}
        />
      </div>
    </div>
  );
}
