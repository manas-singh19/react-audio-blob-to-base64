import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
// axios
import axios from 'axios';

export default function App() {
  const [url, setURL] = useState();
  const [audioBase64, setAudioBase64] = useState<any>('');

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );

  const reader = new FileReader();

  const addAudioElement = (blob: any) => {
    setURL(blob); // save blob

    // base64 conversion
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      console.log(base64data);
      setAudioBase64(base64data); // save base64
    };

    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  
  const [timmer, setTimmer] = useState(0); 
  useEffect(() => {
    setTimmer(recorderControls.recordingTime);
    if (timmer == 5) {
      console.log('stop here');
      recorderControls.stopRecording();
    }
    return () => {
      recorderControls.stopRecording();
    };
  }, [recorderControls.recordingTime]);

  return (
    <div>
      --{timmer}--
      <div style={{ display: 'none' }}>
        <AudioRecorder
          onRecordingComplete={(blob) => addAudioElement(blob)}
          recorderControls={recorderControls}
          // downloadOnSavePress={true}
          // downloadFileExtension="mp3"
          showVisualizer={true}
        />
      </div>
      <br />
      <button onClick={recorderControls.startRecording}>Start Recording</button>
      <br />
      <br />
      <button onClick={recorderControls.stopRecording}>Stop Recording</button>
      <span>{recorderControls.recordingTime}</span>
      <br />
    </div>
  );
}

/*
  In case you'd like to update colors of the icons just follow the instruction here:
  https://github.com/samhirtarif/react-audio-recorder/issues/19#issuecomment-1420248073
*/
