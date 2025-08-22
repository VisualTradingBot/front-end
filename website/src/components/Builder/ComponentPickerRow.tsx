import { useRef } from "react";
import "./ComponentPickerRow_stylesheet.scss";
import { PresetNode } from "../../components/Builder/components";

// Carousel component for picking components
export default function ComponentPickerRow({
  PRESET_COMPONENTS,
  title,
  componentClassName,
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <div className={`component-picker ${componentClassName}`}>
      <h2>{title}</h2>
      <div className="carousel">
        <button className="carousel-button left" onClick={scrollLeft}>
          &larr;
        </button>
        <div className="component-list" ref={scrollContainerRef}>
          {PRESET_COMPONENTS.map((preset, idx) => (
            <div
              key={idx}
              className="component-picker-preset"
              draggable
              onDragStart={(event) => {
                // Set the data to be transferred during the drag
                const dragData: PresetNode = {
                  label: preset.label,
                  type: preset.type,
                  family: preset.family,
                  id: `${+new Date()}`,
                };
                console.log("Drag data:", dragData);
                // Stringify and send the data to ReactFlow Canvas
                event.dataTransfer.setData(
                  "application/reactflow",
                  JSON.stringify(dragData)
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
