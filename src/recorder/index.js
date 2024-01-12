import React, { useEffect, useState } from 'react'
import axios from "axios"
import Loader from "react-js-loader"

let chunks = [];
function Index({ addMessage, apiUrl, language }) {
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [mediaRecorderStatus, setMediaRecorderStatus] = useState(false)
    const [mediaRecordingStatus, setMediaRecordingStatus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [audioS, setAudioSource] = useState(null)
    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                const mediaRecorderS = new MediaRecorder(stream);
                console.log(mediaRecorderS)
                setMediaRecorder(mediaRecorderS)
                setMediaRecorderStatus(true)
            }).catch((error) => console.log(error))
        } else {
            alert("cannot record the audio on this device")
        }
    }, [])

    const onStopRecording = () => {
        setLoading(true)
        mediaRecorder.stop();
        setMediaRecordingStatus(false)
        console.log(mediaRecorder.state);
        // mediaRecorder.ondataavailable = (e) => {
        console.log("recorder stopped");
        mediaRecorder.ondataavailable = (e) => {
            console.log("media storing data", e)
            const blob = new Blob([e.data], { type: "audio/mpeg" });
            console.log(blob)
            const formData = new FormData()
            formData.append("audio", blob, "recording.mp3")
            sendToBackend(formData)
            // const audioURL = window.URL.createObjectURL(blob);
            // setAudioSource(audioURL)
        };
        // }
    }

    const replayPlayer = (audioData) => {
        function hexToBytes(hex) {
            for (var bytes = [], c = 0; c < hex.length; c += 2)
                bytes.push(parseInt(hex.substr(c, 2), 16));
            return new Uint8Array(bytes);
        }
        function hexToBinary(hex) {
            return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        }
        var hexValues = audioData.split(" "); // Your hexadecimal audio data
        const audioBufferBytes = new Uint8Array(hexValues.map(hex => parseInt(hex, 16)));
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioSource = audioContext.createBufferSource();
        audioContext.decodeAudioData(audioBufferBytes.buffer, (audioBuffer) => {
            // Set the decoded audio data as the buffer
            audioSource.buffer = audioBuffer;

            // Connect the AudioBufferSourceNode to the AudioContext's destination (e.g., speakers)
            audioSource.connect(audioContext.destination);
            setAudioSource(audioSource)
            // Start playing the audio
            audioSource.start();
        }, (error) => {
            console.error("Error decoding audio:", error);
        });
    }

    const sendToBackend = (data) => {
        console.log("Sending to Backend")
        axios
            .post(apiUrl, data)
            .then((response) => {
                // localStorage.setItem("audio", response.data.audio_response_buffer);
                console.log(response)
                // setMyAudioSrc(response.data.audio_response_buffer);
                replayPlayer(response.data.audio_response_buffer)
                addMessage("bot", response.data.text_response, "text", language)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error sending audio to backend:", error);
                setLoading(false)
            });
    }

    const startRecording = () => {
        audioS?.stop()
        setMediaRecordingStatus(true)
        mediaRecorder?.start()
        console.log(mediaRecorder.state);
    }

    if (!mediaRecorderStatus) return <div>not</div>

    return (
        <div className="promo-video">
            <div>
                <button type="button" className="send-button" disabled={loading} onClick={mediaRecordingStatus ? onStopRecording : startRecording}>{loading ? <div className='loader'>
                    <Loader type="spinner-circle" bgColor={"white"} color={"white"} size={35} />
                </div> : mediaRecordingStatus ? <i className='fas fa-stop'></i> : <i className='fas fa-microphone'></i>}</button>
                {mediaRecordingStatus ? <div>
                    <div className="waves wave-1" />
                    <div className="waves wave-2" />
                    <div className="waves wave-3" />
                </div> : <div className='none' />}
            </div>
        </div>
    )
}

export default Index
