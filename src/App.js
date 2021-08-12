import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import VideoChat from './VideoChat';
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
      {/* {
        windowType ? 
          <h3>{windowType}</h3> : null
      }
      <br />
      <br />
      <br />      
      <button onClick={sendMessage}>SEND MESSAGE</button><br />
      <button onClick={sendInitMessage}>INIT TWILIO</button> */}

      <div>
        {
          windowType === "main-window" ?
          <VideoChat 
            windowType={windowType}
            twilioInitData={twilioInitData}
          />
          :
          null
        }
      </div>

    </div>
  );
}

export default App;
