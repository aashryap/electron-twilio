import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import VideoChat from './VideoChat';


function App() {
  const [windowType, setWindowType] = useState(null);

  useEffect(() => {
    window.ipcRenderer.on('message', (event, message) => {
      console.log("----------MESSAGE----------",message);
    });
    setWindowType(window.windowType);
  },[])

  const sendMessage = () => {
    window.ipcRenderer.send('message', {
      message: `This message was sent from ${windowType}`, 
      origin: windowType});
  }

  return (
    <div className="App">
      {
        windowType ? 
          <h3>{windowType}</h3> : null
      }
      <br />
      <br />
      <br />      
      <button onClick={sendMessage}>SEND MESSAGE</button>

      <div>
        {
          windowType === "main-window" ?
          <VideoChat 
            windowType={windowType}
          />
          :
          null
        }
      </div>

    </div>
  );
}

export default App;
