import React, {useState} from 'react';
import Lobby from './Lobby';
import Room from "./Room";

const VideoChat = ({windowType}) => {
    const [userName, setUserName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [token, setToken] = useState(null);

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    }

    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value)
    }

    const handleSubmit = async () => {
        console.log("DO SOMETHING");
        const data = await fetch('http://secret-retreat-99293.herokuapp.com/video/token', {
        // const data = await fetch('http://localhost:4000/video/token', {
            method: 'POST',
            body: JSON.stringify({
              identity: userName,
              room: roomName
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json());
          console.log("DATA ", data);
          setToken(data.token);
    }



    return (<div>
        {
            token ? 
                <Room 
                    token={token}
                    roomName={roomName}
                />    :
                <Lobby 
                    userName={userName}
                    roomName={roomName}
                    token={token}
                    handleRoomNameChange={handleRoomNameChange}
                    handleUserNameChange={handleUserNameChange}
                    handleSubmit={handleSubmit}
                />
        }
    </div>);
}

export default VideoChat;
