export { Box, ComponentPicker };
import { Handle, Position } from "reactflow";
import { useRef } from "react";
import "./components.scss"; // Import styles

// Update Box to allow message input and show received message
function Box({ id, data, preview }) {
  return (
    <div
      className="box"
      style={{
        pointerEvents: preview ? "none" : {},
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

function ComponentPicker({ PRESET_NODES, title, nameComponentClass }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -150, // Scroll left by 150px
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 150, // Scroll right by 150px
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`${nameComponentClass}`}>
      <h2>{title}</h2>
      <div className="carousel">
        <button className="carousel-button left" onClick={scrollLeft}>
          &larr;
        </button>
        <div className="component-list" ref={scrollContainerRef}>
          {PRESET_NODES.map((preset, idx) => (
            <div
              key={idx}
              className="box-preset"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(
                  "application/reactflow",
                  `${preset.type},${preset.label}`
                );
              }}
            >
              <h4>{preset.label}</h4>
            </div>
          ))}
        </div>
        <button className="carousel-button right" onClick={scrollRight}>
          &rarr;
        </button>
      </div>
    </div>
  );
}
