import React, {useEffect, useState} from 'react';
import Lobby from './Lobby';
import Room from "./Room";
import service from './services/service';

const VideoChat = ({windowType, twilioInitData}) => {
    const [userName, setUserName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        console.log("aaaaaaaaa ", twilioInitData);
        if (twilioInitData !== null) {
            setUserName(twilioInitData.participantName);
            setRoomName(twilioInitData.roomName);
            getTwilioToken({userName: twilioInitData.participantName, roomName: twilioInitData.roomName});
        }
    },[twilioInitData]);

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    }

    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value)
    }

    const getTwilioToken = async ({userName, roomName}) => {
        const data = await service.getToken({userName, roomName});
        setToken(data.token);
    }

    const handleSubmit = async () => {
        getTwilioToken({userName, roomName});
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
