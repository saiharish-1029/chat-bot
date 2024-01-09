import React from "react";
// import "react-voice-recorder/dist/index.css";
import "./styles.css";
import Chatbot from "./components/Chatbot"

function App() {
  return (
    <div className="App">
      <Chatbot />
    </div>
  );
}

export default App
// <audio src={audioURL} controls />
// <button onClick={startRecording} disabled={isRecording}>
//   start recording
// </button>
// <button onClick={stopRecording} disabled={!isRecording}>
//   stop recording
// </button>