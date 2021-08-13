
import { useEffect, useState } from 'react';
import VideoChat from './twilio/VideoChat';
import {getUrlParams} from './utils';
import './styles/tailwind.css';
import {Controls} from './twilio/Controls';
import {WhjrLogo} from "./WhjrLogo";

function App() {
  const [twilioInitData, setTwilioInitData] = useState(null);

  useEffect(() => {
    if (window.api){
      window.api.receive('message', (message) => {
        eventHandler(message);
        console.log({message});
      });
      window.api.send('react-ready', true);
    }

  },[]);

  const eventHandler = ({type, data}) => {
    switch(type) {
      case 'INIT_TWILIO':
        const twilioData = data ? getUrlParams(data): null;
        setTwilioInitData(twilioData);
        console.log(twilioData);
        break;
      default :
        break;
    } 
  }

  return (
    <div className="w-screen h-screen relative pb-24 bg-white font-ro transition transition-colors">
    {
      twilioInitData ? 
      <VideoChat
        roomName={twilioInitData.roomName}
        twilioToken={twilioInitData.token}
      >
        {(participants,getParticipant,localState, localParticipantIdentity, controls, logout)=>{

          const remoteParticipants = participants.filter(({identity}) => identity !== localParticipantIdentity);

            return (<>
                <div className="flex h-full p-4">
                  <div className="w-3/4 h-full mr-4 pb-4">
                    <div className="relative h-full pt-24">
                      <div className="absolute rounded top-0 left-0 w-full h-20 bg-blue-100 flex items-center px-4">
                        <WhjrLogo height={54} width={200} className="mb-3"></WhjrLogo>
                      </div>
                    {
                      getParticipant({participant: {identity: localParticipantIdentity}, name:"Me"})
                    }
                    </div>
                  </div>
                  <div className="w-1/4 overflow-y-auto bg-blue-100 rounded mb-4 p-2">
                    {remoteParticipants.length ? <>
                      {
                        remoteParticipants.map((participant,i)=>{
                          return <div className="pb-2 w-full h-1/3" key={participant.identity}>{getParticipant({participant, name:`#${i+1} Handsome`})}</div>
                        })
                      }
                    </> : <>
                      <div className="text-center text-sm text-gray-500 mt-3">Waiting for others to join...</div>
                    </>}
                  </div>
                </div>
              
              
              <div className="absolute w-full h-24 left-0 bottom-0 px-4 mb-4">
                <Controls 
                  isAudioOn={localState.isAudioOn} 
                  isWebcamOn={localState.isWebcamOn} 
                  onWebcamClick={() => {
                    if (localState.isWebcamOn) {
                      controls.video.stop();
                    } else {
                      controls.video.start();
                    }
                  }}
                  onAudioClick={() => {
                    if (localState.isAudioOn) {
                      controls.audio.stop();
                    } else {
                      controls.audio.start();
                    }
                  }}
                  onCallDisconnect={()=>{
                    logout();
                    window.api.send('react-close', true);
                  }}
                />
              </div>
            </>
            )
            
          }}
      </VideoChat>
    :
    <>
      <div></div>
    </>
    }
      
      
    </div>
  )
}

export default App;
