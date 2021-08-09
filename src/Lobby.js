import React from 'react';

const Lobby = ({
    userName,
    roomName,
    handleRoomNameChange,
    handleUserNameChange,
    handleSubmit,
    token
}) => {
        return (
        <div>
            <input type="text" onChange={handleRoomNameChange} value={roomName} placeholder="Room Name"/>
            <input type="text" onChange={handleUserNameChange} value={userName} placeholder="User Name" />
            <button onClick={handleSubmit}>SUBMIT</button>
        </div>);
}

export default Lobby;
