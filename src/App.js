
import { useEffect, useState } from 'react';
import VideoChat from './twilio/VideoChat';
import util from './utils';
import './styles/tailwind.css';
import {Controls} from './twilio/Controls';

function App() {
  const [twilioInitData, setTwilioInitData] = useState(null);

  useEffect(() => {
    if (window.api){
      window.api.receive('message', (message) => {
        console.log("MEssage", message);
        eventHandler(message)
      });
      window.api.send('react-ready', true);
    }

  },[]);

  const eventHandler = ({type, data}) => {
    switch(type) {
      case 'INIT_TWILIO':
        const twilioData = data ? util.getDataFromURL(data): null;
        console.log(twilioData);
        setTwilioInitData(twilioData);
        break;
      default :
        break;
    } 
  }
  console.log(twilioInitData);
  return (
    <div className="w-screen h-screen relative pb-32 bg-white font-ro"> 
    {
      twilioInitData ? 
      <VideoChat
        roomName={twilioInitData.roomName}
        twilioToken={twilioInitData.token}
      >
        {(participants,getParticipant,localState, localParticipantIdentity, controls)=>{
            return (<>
              <div className="flex h-full p-6">
                <div className="w-3/4 pr-6">
                {
                  getParticipant({participant: {identity: localParticipantIdentity}})
                }
                </div>
                <div className="w-1/4 overflow-y-auto">
                {
                  participants.filter(({identity}) => identity !== localParticipantIdentity).map((participant)=>{
                    return <div className="pb-6" key={participant.identity}>{getParticipant({participant})}</div>
                  })
                }
                </div>
              </div>
              
              
              <div className="absolute w-full h-32 left-0 bottom-0 px-6 mb-6">
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
                  onCallDisconnect={()=>{}}
                  
                />
              </div>
            </>
            )
            
          }}
      </VideoChat>
    :
    <>
      <div>NO DATA</div>
    </>
    }
      
      
    </div>
  )
}

export default App;
