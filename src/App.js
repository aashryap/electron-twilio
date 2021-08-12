import logo from './logo.svg';
import { useEffect, useState } from 'react';
// import VideoChat from './VideoChat';
import VideoChatMain from './twilio/VideoChat';
import util from './utils';
import service from './services/service';
import './styles/tailwind.css';
import {Controls} from './twilio/Controls';
// import "../public"

function App() {
  const [windowType, setWindowType] = useState(null);
  const [twilioInitData, setTwilioInitData] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {

    window.api.receive('message', (message) => {
      console.log("----------MESSAGE----------",message);
      eventHandler(message)
    });
    setWindowType(window.windowType);

    service.getToken({
      userName: "Aashrya",
      roomName: "abc"
    }).then((data) => {
      setToken(data.token);
    });

    window.api.send('app-ready', true);

  },[]);

  const eventHandler = ({type, data}) => {
    switch(type) {
      case 'INIT_TWILIO':
        const twilioData = data ? util.getDataFromURL(data): null;
        console.log("TWILIO DATA ", twilioData);
        setTwilioInitData(twilioData);
        break;
      default :
        noOp()
    } 
  }

  const noOp = () => {
    console.log("NO OP");
  }

  const sendMessage = () => {
    window.ipcRenderer.send('message', {
      message: {
        type: "INIT_TWILIO",
        data: ""
      }, 
      origin: windowType});
  }

  const sendInitMessage = () => {
    window.ipcRenderer.send('message', {
      type: "INIT_TWILIO",
      data: "inclass://?roomName=class&participantName=Aashray", 
      origin: windowType});
  }

  return (
    <div className="w-screen h-screen relative pb-32 bg-white font-ro"> 
    {
      twilioInitData ? 
      <VideoChatMain
        roomName={twilioInitData.roomName}
        twilioToken={twilioInitData.token}
        // roomName={'cfad11bc-492a-41c4-b581-e365b68db512'}
        // twilioToken={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzc0ZmNiNTI2OWNlMjUzY2VhMjY3M2RiNDU1YmEwNDEzLTE2Mjg3Njg5MTEiLCJncmFudHMiOnsiaWRlbnRpdHkiOiI1NzM2MTEyNC1kNGM2LTRkMGMtOTZiYi1jY2I2NjU1OGQ1YjEiLCJ2aWRlbyI6e319LCJpYXQiOjE2Mjg3Njg5MTEsImV4cCI6MTYyODc3MjUxMSwiaXNzIjoiU0s3NGZjYjUyNjljZTI1M2NlYTI2NzNkYjQ1NWJhMDQxMyIsInN1YiI6IkFDMjM1YmMwOGMyYzM4NDc1YzRmNWExOTc0OWNjYmJkM2MifQ.VYJeAvWvOJTguNnPhVQs3FIK6pruFXZ2Z3mUXhCxBNY"}
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
      </VideoChatMain>
    :
    <></>
    }
      
      
    </div>
  )
}

export default App;


// {/* {
//         windowType ? 
//           <h3>{windowType}</h3> : null
//       }
//       <br />
//       <br />
//       <br />      
//       <button onClick={sendMessage}>SEND MESSAGE</button><br />
//       <button onClick={sendInitMessage}>INIT TWILIO</button> */}

//       {/* <button onClick={sendInitMessage}>INIT TWILIO</button> */}
      
//       {/* <div>
//         {
//           windowType === "main-window" ?
//           <VideoChat 
//             windowType={windowType}
//             twilioInitData={twilioInitData}
//           />
//           :
//           null
//         }
//       </div> */}