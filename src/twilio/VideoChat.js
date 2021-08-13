import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import {Room} from "./Room";

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

  useEffect(() => {
    if (twilioToken && roomName) {
      const TwilioConnect = function(token, name, tracks = null) {
        Video.connect(token, {
          name,
          networkQuality: {
            local: 1,
            remote: 2
          },
          tracks
        })
          .then(room => {
            setRoom(room);
          })
          .catch(err => {
            if (err && MEDIA_ERRORS.includes(err.name)) {

            } else {

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
      handleLogout={handleLogout}
    >
      {children}
    </Room>
  ) : (
    <>
    </>
  );
};

export default VideoChat;
