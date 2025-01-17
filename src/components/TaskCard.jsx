/* eslint-disable react/prop-types */
import React from "react";

function TaskCard(props) {
  // Split content at the first colon
  const [title, ...rest] = props.content.split(":");
  const content = rest.join(":"); // Rejoin the rest in case there are other colons

  return (
    <div className="task-card">
      <div className="task-content">
        <p>
          <span className="task-title">{title}</span>
          {content && ":" + content}
        </p>
      </div>
      <button
        className="delete-button"
        onClick={() => props.onDelete(props.id)}
      >
        ×
      </button>
      {props.children}
    </div>
  );
}

export default TaskCard;
