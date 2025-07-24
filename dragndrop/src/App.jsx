import "./App.scss";
import { useCallback, useState, useRef, useEffect } from "react";
import ReactFlow, {
  Handle,
  Position,
  addEdge,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const PRESET_NODES = [
  { type: "custom", label: "Box", color: "#2a7b9b" },
  { type: "custom", label: "Box", color: "#2a7b9b" },
  // Add more presets here if needed
];

// Update Box to allow message input and show received message
function Box({ id, data, preview, dragged }) {
  return (
    <div
      className="box"
      style={{
        pointerEvents: preview ? "none" : {},
        opacity: dragged ? 0.5 : 1,
      }}
    >
      {!preview && (
        <div className="left-connections">
          <Handle
            key={`left`}
            type="target"
            position={Position.Left}
            id={`left`}
            style={{ top: "50%", left: "2%" }}
          />
        </div>
      )}
      <div className="main-contents">
        <div className="box-title">
          <h3>{data?.label || "title"}</h3>
        </div>
        <div className="box-content">
          <input
            id={`message-input-${id}`}
            className="nodrag"
            type="text"
            value={data?.message || ""}
            onChange={(e) => data?.onMessageChange?.(id, e.target.value)}
            placeholder="Type a message"
            disabled={preview}
          />
          {data?.receivedMessage && (
            <div className="received-message">
              <strong>Received:</strong> {data.receivedMessage}
            </div>
          )}
        </div>
      </div>
      {!preview && (
        <div className="right-connections">
          <Handle
            key={`right`}
            type="source"
            position={Position.Right}
            id={`right`}
            style={{ top: `50%`, right: "2%" }}
          />
        </div>
      )}
    </div>
  );
}

const nodeTypes = { custom: Box };

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
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      // Calculate position relative to canvas
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // when dropping, the box should be placed where the pointer is
      setNodes((nds) => [
        ...nds,
        {
          id: `${+new Date()}`,
          type,
          position: position,
          data: {
            label: `Box ${nds.length + 1}`,
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
        {PRESET_NODES.map((preset, idx) => (
          <div
            key={idx}
            className={`box-preset`}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/reactflow", preset.type);
            }}
          >
            <Box data={{ label: preset.label }} preview />
          </div>
        ))}
      </div>
    </div>
  );
}
