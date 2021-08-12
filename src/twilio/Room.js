import React, { useEffect } from "react";

import Participant from "./Participant";
import { useCommunication } from "./hooks/useCommunication";
import { useRoomParticipantTrackMap } from "./hooks/useRoomParticipantTrackMap";
import { useParticipants } from "./hooks/useParticipants";

export const Room = ({
  room,
  getIdentityInfo = () => {},
  children
}) => {

  useEffect(() => {
    if (room){
      return ()=>{
        room.localParticipant.tracks.forEach(
          publication => {
            publication.track.stop();
            publication.unpublish();
          }
        );
        room.disconnect();
      }
    }
  }, [room]);


  const [participants] = useParticipants(
    room,
    ()=>{},
    () => {}
  );

  const [communication] = useCommunication(room);

  const [roomParticipantTrackMap] = useRoomParticipantTrackMap(room);

  const getParticipant = ({
    participant
  }) => {
    const { identity } = participant || {};
    const name = "";
    const isScreenOn = communication[identity] && communication[identity].isScreenOn;
    const isWebcamOn = communication[identity] && communication[identity].isWebcamOn;
    const isAudioOn = communication[identity] && communication[identity].isAudioOn;

    const webcamTrack = roomParticipantTrackMap[identity] ? roomParticipantTrackMap[identity].webcam : null;
    const screenTrack = roomParticipantTrackMap[identity] ? roomParticipantTrackMap[identity].screen : null;
    const screenAudioTrack = roomParticipantTrackMap[identity] ? roomParticipantTrackMap[identity].screenAudio : null;
    const audioTrack = roomParticipantTrackMap[identity] ? roomParticipantTrackMap[identity].audio : null;

    return (
      <Participant
        identity={identity}
        isScreenOn={isScreenOn}
        isWebcamOn={isWebcamOn}
        isAudioOn={isAudioOn}
        webcamTrack={webcamTrack}
        screenTrack={screenTrack}
        screenAudioTrack={screenAudioTrack}
        audioTrack={audioTrack}
        name={name}
        imageUrl={""}
      />
    );
  };

  return (
    <>
      {children ? (
        children(
          participants,
          getParticipant,
          communication[room.localParticipant.identity]
        )
      ):<></>}
    </>
  );
};
