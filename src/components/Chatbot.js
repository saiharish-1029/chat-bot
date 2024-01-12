import React, { useState } from "react";
import "./Chatbot.css";
import useRecorder from "../useRecorder";
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
// import axios from "axios"
import Index from "../recorder";
import tata from "../Tata_logo.png"
import { Box, Tab, Tabs } from "@mui/material";

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [messagesHindi, setMessagesHindi] = useState([])
  const [messagesEnglish, setMessagesEnglish] = useState([])
  const [inputText, setInputText] = useState("")
  const [recordState, setRecordState] = useState(null)
  const [chatBotStatus, setChatBotStatus] = useState(false)
  const [audioState, setAudioState] = useState(null)
  const [audioLoading, setAudioLoading] = useState(false)
  let [audioURL, isRecording, startRecording, stopRecording, audio] = useRecorder();
  const [language, setLanguage] = useState("Hindi")
  const [languageTab, setLanguageTab] = useState(0)
  const apis = {
    Hindi: "https://voicebot.tatasteelretailverse.com/process_audio_hindi",
    English: "https://voicebot.tatasteelretailverse.com/process_audio_english",
    // Hindi: "http://192.168.10.54:5050/process_audio_gpt4",
    // English: "http://192.168.10.54:5040/process_audio_gpt3.5",
  }
  const handleInputChange = (e) => {
    setInputText(e.target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;
    addMessage("user", inputText, "text", language);
    // Simulate a response from the chatbot (you can replace this with actual chatbot logic)
    setTimeout(() => {
      addMessage("bot", "This is a sample response from the chatbot.", "text", language);
    }, 1000);
    setInputText("")
  };

  const audioSubmit = () => {
    stopRecording()
    // addMessage("user", audio, "audio");
    const formData = new FormData()
    formData.append("audio", audioURL)
    fetch("/", { method: "POST", body: formData, headers: { "content-type": "multipart/form-data", } }).then((responseData) => console.log(responseData)).catch((error) => console.log(error))
  }

  const addMessage = (sender, text, type, lang) => {
    const newMessage = { sender, text, type };
    if (lang === "Hindi") {
      setMessages((prev) => [...prev, newMessage])
      setMessagesHindi((prev) => [...prev, newMessage])
    } else {
      setMessages((prev) => [...prev, newMessage])
      setMessagesEnglish((prev) => [...prev, newMessage])
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
                <Tab label="Hindi" onClick={() => { setLanguage("Hindi"); setMessages(messagesHindi) }} />
                <Tab label="English" onClick={() => { setLanguage("English"); setMessages(messagesEnglish) }} />
              </Tabs>
            </Box>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className="message bot-message" >
                {message.type === "text" ? message.text : <audio src={message.text} type="audio/mp3" controls />}
              </div>
            ))}
          </div>
          {/* <div style={{ opacity: 0, height: 0, overflow: "hidden" }}>
          <AudioReactRecorder state={recordState} onStop={onStop} />
        </div> */}
          <form className="form" onSubmit={handleSubmit}>
            <div className="promo-video">
              <Index addMessage={addMessage} language={language} apiUrl={apis[language]} />
            </div>
          </form>
        </div> : <div className="chatbot-icon" onClick={() => setChatBotStatus(true)}><img src={tata} width="50px" /></div>}
      </div>
    </div>
  );
}

export default Chatbot;

// {/* <button type="button" className="send-button" onMouseDown={() => console.log("down")} onMouseUp={() => console.log("up")}><i className="fas fa-microphone"></i></button> */}
