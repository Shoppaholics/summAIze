/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";

import PropTypes from "prop-types";

import { generateTasks } from "../api/geminiai";

function Input(props) {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, window.innerHeight * 0.3)}px`;
    }
  }, [inputText]);

  function handleChange(event) {
    setInputText(event.target.value);
  }

  async function submitText(event) {
    // Prevent form submission if it's a form submit event
    if (event) event.preventDefault();

    if (inputText.trim()) {
      setIsGenerating(true);
      try {
        const generatedTasks = await generateTasks(inputText);

        generatedTasks.forEach((taskContent) => {
          props.onAdd({ content: taskContent });
        });

        setInputText("");
      } catch (error) {
        console.error("Error processing text:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  }

  // Handle enter key press
  function handleKeyPress(event) {
    // Check if Enter was pressed without Shift key
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default enter behavior
      submitText();
    }
  }

  return (
    <div className="input-container">
      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          name="content"
          placeholder="Enter text to summarize... (Press Enter to submit)"
          value={inputText}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={submitText}
          disabled={isGenerating || !inputText.trim()}
          className="submit-button"
        >
          {isGenerating ? "..." : "+"}
        </button>
      </div>
    </div>
  );
}

Input.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default Input;
