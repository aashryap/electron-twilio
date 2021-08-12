import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
// import VideoChat from './VideoChat';
import VideoChatMain from './twilio/VideoChat';
import util from './utils';
// import "../public"


function App() {
  const [windowType, setWindowType] = useState(null);
  const [twilioInitData, setTwilioInitData] = useState(null);
  useEffect(() => {
    window.ipcRenderer.on('message', (event, message) => {
      console.log("----------MESSAGE----------",message);
      eventHandler(message)
    });
    setWindowType(window.windowType);
  },[]);

  const eventHandler = ({type, data}) => {
    switch(type) {
      case 'INIT_TWILIO':
        const twilioData = util.getDataFromURL(data);
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
    <div className="App"> 
  <div>asdasdadasd</div>
      <VideoChatMain
        roomName={'5c4da4b6-8740-4638-8af8-dfce98d78081'}
        twilioToken={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzc0ZmNiNTI2OWNlMjUzY2VhMjY3M2RiNDU1YmEwNDEzLTE2Mjg3Njg5MTEiLCJncmFudHMiOnsiaWRlbnRpdHkiOiI1NzM2MTEyNC1kNGM2LTRkMGMtOTZiYi1jY2I2NjU1OGQ1YjEiLCJ2aWRlbyI6e319LCJpYXQiOjE2Mjg3Njg5MTEsImV4cCI6MTYyODc3MjUxMSwiaXNzIjoiU0s3NGZjYjUyNjljZTI1M2NlYTI2NzNkYjQ1NWJhMDQxMyIsInN1YiI6IkFDMjM1YmMwOGMyYzM4NDc1YzRmNWExOTc0OWNjYmJkM2MifQ.VYJeAvWvOJTguNnPhVQs3FIK6pruFXZ2Z3mUXhCxBNY"}
      >    
        {(participants,getParticipant,localState)=>{
            return participants.map((participant)=>{
              return <div key={participant.identity}>{getParticipant({participant})}</div>
            })
          }}
      </VideoChatMain>
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