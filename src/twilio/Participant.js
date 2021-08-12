import React, { useEffect, useRef } from "react";

const Participant = ({
  isWebcamOn = false,
  isAudioOn = false,
  name = "",
  webcamTrack,
  audioTrack
}) => {
  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    if (isWebcamOn && webcamTrack && videoRef.current) {
      webcamTrack.attach(videoRef.current);
      return () => {
        webcamTrack.detach(videoRef.current);
      };
    }
  }, [webcamTrack, isWebcamOn]);

  useEffect(() => {
    if (isAudioOn && audioTrack && audioRef.current) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach(audioRef.current);
      };
    }
  }, [audioTrack, isAudioOn]);


  return (
    <div className={`rounded-xl overflow-hidden`}>
      <video
        data-name={name}
        className={`${isWebcamOn ? "video-on" : "video-off"} w-full`}
        ref={videoRef}
        autoPlay={true}
      />
      <audio ref={audioRef} autoPlay={false} />
    </div>
  );
};

export default Participant;
