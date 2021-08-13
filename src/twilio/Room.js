import React, { useEffect } from "react";

import Participant from "./Participant";
import { useCommunication } from "./hooks/useCommunication";
import { useRoomParticipantTrackMap } from "./hooks/useRoomParticipantTrackMap";
import { useParticipants } from "./hooks/useParticipants";
import Video from "twilio-video";

export const Room = ({
  room,
  getIdentityInfo = () => {},
  children,
  handleLogout
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

  const stopAllLocalWebcamTracks = room => {
    room.localParticipant.videoTracks.forEach(publication => {
        publication.track.stop();
        publication.unpublish();
    });
  };  

  const stopAllLocalAudioTracks = room => {
    room.localParticipant.audioTracks.forEach(publication => {
        publication.track.disable();
    });
  };  

  const startAllLocalAudioTracks = room => {
    room.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
    });
  };  

  const startAllLocalWebcamTracks = room => {
    Video.createLocalTracks({
      audio: false,
      video:{
        width: 640,
        height: 480,
        frameRate: 24
      }
    })
      .then(localTracks => {
        room.localParticipant.publishTrack(localTracks[0])
        .then(() => {

        })
      })
      .catch(err => {
        console.log(`Create local tracks Error.`, err);
      });
  };

  const getParticipant = ({
    participant,
    name
  }) => {
    const { identity } = participant || {};
    const isWebcamOn = communication[identity] && communication[identity].isWebcamOn;
    const isAudioOn = communication[identity] && communication[identity].isAudioOn;

    const webcamTrack = roomParticipantTrackMap[identity] ? roomParticipantTrackMap[identity].webcam : null;
    const audioTrack = roomParticipantTrackMap[identity] ? roomParticipantTrackMap[identity].audio : null;

    return (
      <Participant
        isWebcamOn={isWebcamOn}
        isAudioOn={isAudioOn}
        webcamTrack={webcamTrack}
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
          communication[room.localParticipant.identity] || {},
          room.localParticipant.identity,
          {
            video: {
              start: () => {startAllLocalWebcamTracks(room)},
              stop: () => {stopAllLocalWebcamTracks(room)}
            },
            audio: {
              start: () => {startAllLocalAudioTracks(room)},
              stop: () => {stopAllLocalAudioTracks(room)}
            }
          },
          handleLogout
        )
      ):<></>}
    </>
  );
};
