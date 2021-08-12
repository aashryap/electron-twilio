import React, { useEffect, useRef } from "react";

const Participant = ({
  isScreenOn = false,
  isWebcamOn = false,
  isAudioOn = false,
  name = "",
  webcamTrack,
  screenTrack,
  screenAudioTrack,
  audioTrack,
}) => {
  const videoRef = useRef();
  const audioRef = useRef();
  const screenRef = useRef();
  const screenAudioRef = useRef();

  useEffect(() => {
    if (webcamTrack && videoRef.current) {
      webcamTrack.attach(videoRef.current);
      return () => {
        webcamTrack.detach(videoRef.current);
      };
    }
  }, [webcamTrack, isWebcamOn]);

  useEffect(() => {
    if (screenTrack && screenRef.current) {
      screenTrack.attach(screenRef.current);
      screenAudioTrack &&
        screenAudioRef.current &&
        screenAudioTrack.attach(screenAudioRef.current);
      return () => {
        screenTrack.detach(screenRef.current);
        screenAudioTrack &&
          screenAudioRef.current &&
          screenAudioTrack.detach(screenAudioRef.current);
      };
    }
  }, [screenTrack, isScreenOn]);

  useEffect(() => {
    if (audioTrack && audioRef.current) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach(audioRef.current);
      };
    }
  }, [audioTrack, isAudioOn]);


  return (
    <>
      <video
        data-name={name}
        style={styles.screenVideo}
        ref={screenRef}
        autoPlay={true}
      />
      <audio ref={screenAudioRef} autoPlay={true} />
      <video
        data-name={name}
        className={`${isWebcamOn ? "video-on" : "video-off"}`}
        style={styles.webcamVideo}
        ref={videoRef}
        autoPlay={true}
      />
      <audio ref={audioRef} autoPlay={true} />
    </>
  );
};

export default Participant;
