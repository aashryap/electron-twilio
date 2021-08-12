import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const Participant = ({participant, pinned}) => {
    const [audioTracks, setAudioTracks] = useState([]);
    const [videoTracks, setVideoTracks] = useState([]);

    const videoRef = useRef();
    const audioRef = useRef();

    const trackpubsToTracks = trackMap => Array.from(trackMap.values())
    .map(publication => publication.track)
    .filter(track => track !== null);

    useEffect(() => {
        const trackSubscribed = track => {
            if (track.kind === 'video') {
                setVideoTracks(videoTracks => [...videoTracks, track]);
              } else {
                setAudioTracks(audioTracks => [...audioTracks, track]);
              }
          };
      
          const trackUnsubscribed = track => {
            if (track.kind === 'video') {
                setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
              } else {
                setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
            }
          };
      
          setVideoTracks(trackpubsToTracks(participant.videoTracks));
          setAudioTracks(trackpubsToTracks(participant.audioTracks));
      
          participant.on('trackSubscribed', trackSubscribed);
          participant.on('trackUnsubscribed', trackUnsubscribed);
      
          return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
          };
    }, [participant]);

    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
          videoTrack.attach(videoRef.current);
          return () => {
            videoTrack.detach();
          };
        }
      }, [videoTracks]);

    return (
        <div>
            <div>{`Name: ${participant.identity}`}</div>
            <div className={`video-container ${pinned ? 'video-pinned' : 'video-unpinned'}`} style={{height: "500px"}}>
              <video ref={videoRef} autoPlay={true} style={{height: "100%"}} />
            </div>
            <audio ref={audioRef} autoPlay={true} mute={true}/>
        </div>
    );
}

export default Participant;
