import React, {useEffect, useRef, useState} from "react";
import {UserPlaceholder} from "../UserPlaceholder";
import {NetworkQualitySign} from "../NetworkQualitySign";

const Participant = ({
  isWebcamOn = false,
  isAudioOn = false,
  name = "",
  webcamTrack,
  audioTrack
}) => {
  const videoRef = useRef();
  const audioRef = useRef();
  const contRef = useRef();

  const [dimensions,setDimensions] = useState(null);
  const [attachTo,setAttachTo] = useState('w-full');

  useEffect(() => {
    const el = videoRef.current;
    if (isWebcamOn && webcamTrack && el) {
      webcamTrack.attach(el);
      return () => {
        webcamTrack.detach(el);
      };
    }
  }, [webcamTrack, isWebcamOn]);

  useEffect(() => {
    const el = audioRef.current;
    if (isAudioOn && audioTrack && el) {
      audioTrack.attach(el);
      return () => {
        audioTrack.detach(el);
      };
    }
  }, [audioTrack, isAudioOn]);

  useEffect(()=>{
    if (webcamTrack && webcamTrack.dimensions){
      setDimensions(webcamTrack.dimensions);
    }
  },[webcamTrack])

  useEffect(()=>{
    const onWindowResize = ()=>{
      const rect = contRef.current.getBoundingClientRect();
      const x = rect.width/dimensions.width;
      const y = rect.height/dimensions.height;
      if (x<y){
        setAttachTo('h-full');
      }else{
        setAttachTo('w-full');
      }
    }
    window.addEventListener('resize',onWindowResize);
    return ()=>{
      window.removeEventListener('resize',onWindowResize);
    }
  },[dimensions])

  return (
    <div className={`overflow-hidden relative w-full h-full rounded bg-opacity-25 bg-black`} ref={contRef}>
      {isWebcamOn ? <></> : <div className="absolute w-full h-full bg-black z-20 flex items-center justify-center"><UserPlaceholder className="fill-current text-white"/></div>}
      <div className="absolute top-0 left-0 w-full p-1 z-30 bg-opacity-25 bg-black">
        <div className="flex items-center">
          <div className="w-6 h-6 flex items-center justify-center text-sm">
            <span className={`fas ${isWebcamOn?"fa-video text-white":"fa-video-slash text-red-500"}`}/>
          </div>
          <div className="w-6 h-6 flex items-center justify-center  text-sm">
            <span className={`fas ${isAudioOn?"fa-microphone text-white":"fa-microphone-slash text-red-500"}`}/>
          </div>
          <div className="ml-auto">
            <NetworkQualitySign/>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full py-1 z-30 bg-opacity-25 bg-black text-white px-2">
        {name}
      </div>
      <video
        className={`top-1/2 right-1/2 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 ${attachTo}`}
        ref={videoRef}
        autoPlay={true}
      />
      <audio ref={audioRef} autoPlay={false} />
    </div>
  );
};

export default Participant;
