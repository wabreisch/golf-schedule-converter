import React from "react";

const DragArea = props => {
  return (
    <div
      className={
        props.hover ? `${props.type} hover` : `${props.type}`
      }
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      onDragLeave={props.onDragLeave}
    >
      <p>{props.labelContent}</p>
    </div>
  );
};

export default DragArea;
