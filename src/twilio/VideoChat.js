import React, { useState, useCallback, useEffect } from "react";
import Video, { isSupported as twilioSupported } from "twilio-video";
import Room from "./Room";

const MEDIA_ERRORS = [
  "NotAllowedError",
  "NotFoundError",
  "NotReadableError",
  "OverconstrainedError",
  "TypeError"
];

const VideoChat = ({
  roomName,
  twilioToken,
  getIdentityInfo,
  children,
}) => {
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [roomConnectionError, setRoomConnectionError] = useState(null);
  const [twilioCleanup,setTwilioCleanup] = useState(()=>{});

  useEffect(() => {
    if (twilioSupported && twilioToken && roomName) {
      const handleMediaError = error => {
        setRoomConnectionError({
          name: error.name,
          message: error.message
        });
      };
      const TwilioConnect = function(token, name, tracks = null) {

        setConnecting(true);

        Video.connect(token, {
          name,
          networkQuality: {
            local: 1,
            remote: 2
          },
          tracks
        })
          .then(room => {
            setRoomConnectionError(null);
            setRoom(room);
            setConnecting(false);
          })
          .catch(err => {
            setConnecting(false);
            if (err && MEDIA_ERRORS.includes(err.name)) {
              handleMediaError(err);
            } else {
              handleMediaError({
                name: err.name,
                message: "Error in connecting Room",
                type: "CUSTOM",
                rawMessage: err.message
              });
            }
          });
      };

      Video.createLocalTracks({
        audio:{
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true
        },
        video:{
          width: 640,
          height: 480,
          frameRate: 24
        }
      })
        .then(localTracks => {
          TwilioConnect(twilioToken, roomName, localTracks);
        })
        .catch(err => {
          console.log(`Create local tracks Error.`, err);
          TwilioConnect(twilioToken, roomName, null);
        });
    }
  }, [twilioToken, roomName]);

  const handleLogout = useCallback(() => {
    setRoom(prevRoom => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach(publication => {
          publication.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (room) {
      const tidyUp = event => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  return room ? (
    <Room
      room={room}
      getIdentityInfo={getIdentityInfo}
    >
      {children}
    </Room>
  ) : (
    <>

    </>
  );
};

export default VideoChat;
