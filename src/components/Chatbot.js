import React, { useState } from "react";
import "./Chatbot.css";
import useRecorder from "../useRecorder";
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
// import axios from "axios"
import Index from "../recorder";
import tata from "../Tata_logo.png"
import { Box, Tab, Tabs } from "@mui/material";
import axios from "axios";
import Loader from "react-js-loader"

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [messagesChat, setMessagesChat] = useState([])
  const [messagesVoice, setMessagesVoice] = useState([])
  const [inputText, setInputText] = useState("")
  const [recordState, setRecordState] = useState(null)
  const [chatBotStatus, setChatBotStatus] = useState(false)
  const [audioState, setAudioState] = useState(null)
  const [messageLoading, setMessageLoading] = useState(false)
  let [audioURL, isRecording, startRecording, stopRecording, audio] = useRecorder();
  const [tab, setTab] = useState("Chat")
  const [languageTab, setLanguageTab] = useState(0)
  const apis = {
    Chat: "http://192.168.10.54:5010/chat",
    Voice: "https://voicebot.tatasteelretailverse.com/process_audio_english",
    // Hindi: "http://192.168.10.54:5050/process_audio_gpt4",
    // English: "http://192.168.10.54:5040/process_audio_gpt3.5",
  }
  const handleInputChange = (e) => {
    setInputText(e.target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setMessageLoading(true)
      if (inputText.trim() === "") return;
      addMessage("user", inputText, "text", tab);
      chatSubmit(inputText.trim())
      setInputText("")
    }
    // Simulate a response from the chatbot (you can replace this with actual chatbot logic)
    // setTimeout(() => {
    //   addMessage("bot", "This is a sample response from the chatbot.", "text", tab);
    // }, 1000);
    // setInputText("")
  };

  const chatSubmit = (question) => {
    // fetch("http://192.168.10.54:5060/chat", { method: "POST", body: JSON.stringify({ question }), headers: { 'Content-Type': 'application/json' } })
    //   .then(res => res.json())
    //   .then(response => {
    //     console.log(response)
    //     addMessage("bot", response.text_response, "text", "Chat")
    //   }).catch(err => console.log(err))
    axios.post(apis.Chat, { question }).then(response => {
      console.log(response)
      addMessage("bot", response.data.text_response, "text", "Chat")
      setMessageLoading(false)
    }).catch(err => {
      console.log(err)
      addMessage("error", err?.message, "text", "Chat")
      setMessageLoading(false)
    })
  }

  const addMessage = (sender, text, type, lang) => {
    const newMessage = { sender, text, type };
    if (lang === "Chat") {
      setMessages((prev) => [...prev, newMessage])
      setMessagesChat((prev) => [...prev, newMessage])
    } else {
      setMessages((prev) => [...prev, newMessage])
      setMessagesVoice((prev) => [...prev, newMessage])
    }
  };

  // const onStop = (audioData) => {
  //   console.log("user", audioData, "audio");
  //   // setAudioState(audioData)
  //   const data = new Blob([audioData.url], { type: "audio/*" })
  //   const met = new FormData()
  //   met.append("file", audioData.url)
  //   // met.append("audio", data)
  //   console.log("audio", data)
  //   setAudioLoading(true)
  //   axios.post("http://localhost:5000/users", met, { "content-type": "multipart/form-data", }).then(({ Response }) => { console.log(Response) }).catch(err => console.log(err)).finally(() => setAudioLoading(false))
  //   fetch("/process_audio", { method: "post", body: met }).then(res => res.json()).then((responseData) => {
  //     setAudioLoading(false)
  //     console.log(responseData)
  //   }).catch((error) => {
  //     setAudioLoading(false)
  //     console.log(error)
  //   })
  // }

  return (
    <div className="chatbot-container">
      <div className="chatbot-animator">
        {chatBotStatus ? <div className="chatbot">
          <div>
            <div className="chatbot-header">
              <div />
              TATA Steel Voice Bot
              <i className="fas fa-window-close close" onClick={() => setChatBotStatus(false)}></i>
            </div>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <Tabs sx={{ width: "50%" }} value={languageTab} onChange={(e, value) => setLanguageTab(value)}>
                <Tab label="Chat" onClick={() => { setTab("Chat"); setMessages(messagesChat) }} />
                <Tab label="Voice" onClick={() => { setTab("Voice"); setMessages(messagesVoice) }} />
              </Tabs>
            </Box>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender === "bot" ? "bot-message" : message.sender === "error" ? "error-message" : "user-message"}`} >
                {message.type === "text" ? message.text : <audio src={message.text} type="audio/mp3" controls />}
              </div>
            ))}
          </div>
          {/* <div style={{ opacity: 0, height: 0, overflow: "hidden" }}>
          <AudioReactRecorder state={recordState} onStop={onStop} />
        </div> */}
          {tab === "Chat" ? <form className="form" onSubmit={handleSubmit}>
            <input className="input-field" type="text" value={inputText} onChange={handleInputChange} placeholder="Enter your question" />
            <button className="send-button" disabled={messageLoading}>{messageLoading ? <Loader type="spinner-circle" bgColor={"white"} color={"white"} size={35} /> : "send"}</button>
          </form> :
            <div className="voice-form">
              <Index addMessage={addMessage} apiUrl={apis.Voice} />
            </div>
          }
        </div> : <div className="chatbot-icon" onClick={() => setChatBotStatus(true)}><img src={tata} width="50px" /></div>}
      </div>
    </div>
  );
}

export default Chatbot;

// {/* <button type="button" className="send-button" onMouseDown={() => console.log("down")} onMouseUp={() => console.log("up")}><i className="fas fa-microphone"></i></button> */}
