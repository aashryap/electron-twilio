import React, { useEffect } from 'react';
import { ControlButton } from './ControlButton';


export const Controls  = ({
        isWebcamOn = false, 
        isAudioOn = false,
        onAudioClick,
        onWebcamClick,
        onCallDisconnect
    }) => {
    console.log({
        isAudioOn,
        isWebcamOn
    })
    return (
        <div className="flex items-center justify-center p-4 bg-gray-100 h-full rounded-xl"> 
                <ControlButton icon={isWebcamOn ? 'fa-video' : 'fa-video-slash'} onClick={onWebcamClick} className="mx-2" label={"Cam"}/>
                <ControlButton icon={isAudioOn? 'fa-microphone' : 'fa-microphone-slash'} onClick={onAudioClick} className="mx-2" label={"Mic"}/>
                <ControlButton icon={'fa-phone-slash'} onClick={onCallDisconnect} className="mx-2" label={"Leave"}/>
                {/* <span onClick={onWebcamClick} className={`fas ${isWebcamOn ? 'fa-video' : 'fa-video-slash'} cursor-pointer`}></span> 
                <span onClick={onAudioClick} className={`fas ${isAudioOn? 'fa-microphone' : 'fa-microphone-slash'} cursor-pointer`}></span> 
                <span onClick={onCallDisconnect} className="fas fa-phone-slash cursor-pointer"></span>  */}
        </div>
    )
};