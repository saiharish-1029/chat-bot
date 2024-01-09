import React from "react";
// import './ChatMessage.css';

const ChatMessage = ({ text, type }) => {
  return (
    <div className={`chat-message ${type}`}>
      <p>{text}</p>
    </div>
  );
};

export default ChatMessage;
