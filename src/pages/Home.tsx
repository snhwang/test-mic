import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, {useRef, useState} from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

import MicRecorder from 'mic-recorder-to-mp3'
import {micCircle, play, stopCircle} from 'ionicons/icons'
import { ReactMic } from '@cleandersonlobo/react-mic';

import {useRecorder } from 'use-recorder'

import AudioPlayer from '../libs/AudioPlayer'

const RecorderStatus = {
  PAUSED: "paused",
  RECORDING: "recording",
  PLAYING: "playing",
  SILENT: "silent"
};



const Home: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = React.useState(RecorderStatus.PAUSED);
  const { start, stop, player } = useRecorder();
  const [micRecordOn, setMicRecordOn] = useState(false)

  const actions = {
    [RecorderStatus.RECORDING]: start,
    [RecorderStatus.PAUSED]: stop,
    [RecorderStatus.PLAYING]: () => player.play(),
    [RecorderStatus.SILENT]: () => player.pause()
  };

  const handleAction = action => {
    setStatus(action);
    actions[action]();
  };




  const micRec = new MicRecorder({
    bitRate: 128,
  });

  const micRecStart = () => {
    // Start recording. Browser will request permission to use your microphone.
    micRec
      .start()
      .then(() => {
        setIsRecording(true);
      }).catch((e) => {
        console.error(e);
      });
  }

  const micRecStop = () => {

  // Once you are done singing your best song, stop and get the mp3.
    micRec
    .stop()
    .getMp3()
    .then(([buffer, blob]) => {
      const file = new File(buffer, 'recording.mp3', {
        type: blob.type,
        lastModified: Date.now()
      })
      setIsRecording(false);
      const player = new Audio(URL.createObjectURL(file));
      player.play();

    }).catch((e) => {
      alert('We could not retrieve your message');
      console.log(e);
    });
  }

  const startRecording = () => {
    setMicRecordOn(true)
  }

  const stopRecording = () => {
    setMicRecordOn(false)
  }

  const onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  const onStop = (recordedBlob) => {
    const player = new Audio(recordedBlob['blobURL']);
    player.play();
    console.log('recordedBlob is: ', recordedBlob);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div>
        <ReactMic
          record={micRecordOn}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          mimeType="audio/mp3"
          strokeColor="#000000"
          backgroundColor="#FFFF81" />
        <button onClick={startRecording} type="button">Start</button>
        <button onClick={stopRecording} type="button">Stop</button>
      </div>

      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        {(status === RecorderStatus.PAUSED ||
          status === RecorderStatus.SILENT) && (
          <IonButton
            onClick={() => handleAction(RecorderStatus.RECORDING)}
            color="danger"
          >
            <IonIcon icon={micCircle} slot="start"/>
            record
          </IonButton>
        )}
        {status === RecorderStatus.RECORDING && (
          <IonButton
            color="danger"
            onClick={() => handleAction(RecorderStatus.PAUSED)}
          >
            <IonIcon icon={stopCircle} slot="start"/>
            stop recording
          </IonButton>
        )}
        {(status === RecorderStatus.PAUSED ||
          status === RecorderStatus.SILENT) &&
          !!player && (
            <IonButton
              color="info"
              onClick={() => handleAction(RecorderStatus.PLAYING)}
            >
              play
            </IonButton>
          )}
        {status === RecorderStatus.PLAYING && (
          <IonButton
            color="info"
            onClick={() => handleAction(RecorderStatus.SILENT)}
          >
            pause
          </IonButton>
        )}
        <IonButton onClick={micRecStart} disabled={isRecording}>
          <IonIcon icon={micCircle} slot="start"/>
          Rec        
        </IonButton>
        <IonButton onClick={micRecStop} disabled={!isRecording}>
          <IonIcon icon={stopCircle} slot="start"/>
          Stop        
        </IonButton>

        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
