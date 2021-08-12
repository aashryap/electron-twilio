import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

const Room = ({token, roomName, handleLogout}) => {
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const remoteParticipants = participants.map(participant => {
        return <Participant key={participant.sid} participant={participant}/>;
    })

    useEffect(() => {
        const participantConnected = participant => {
          setParticipants(prevParticipants => [...prevParticipants, participant]);
        };
        const participantDisconnected = participant => {
          setParticipants(prevParticipants =>
            prevParticipants.filter(p => p !== participant)
          );
        };
        Video.connect(token, {
          name: roomName
        }).then(room => {
          setRoom(room);
          room.on('participantConnected', participantConnected);
          room.on('participantDisconnected', participantDisconnected);
          room.participants.forEach(participantConnected);
        });
        
        return () => {
            setRoom(currentRoom => {
              if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
                  trackPublication.track.stop();
                });
                currentRoom.disconnect();
                return null;
              } else {
                return currentRoom;
              }
            });
          };
    }, [roomName, token]);

    return (
        <div>
            <h2>{`Room Name : ${roomName}`}</h2>
            <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
              <div>
                  {
                      room ? 
                          <Participant pinned key={room.localParticipant.sid} participant={room.localParticipant}/>:
                      null
                  }
              </div>
              <div>
                <h3>Remote participants</h3>
                  {remoteParticipants}
              </div>
            </div>
            
        </div>
    )
};

export default Room;