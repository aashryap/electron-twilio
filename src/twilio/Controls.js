import React from 'react';
import { ControlButton } from './ControlButton';

export const Controls  = ({
        isWebcamOn = false, 
        isAudioOn = false,
        onAudioClick,
        onWebcamClick,
        onCallDisconnect
    }) => {
    return (
        <div className="flex items-center justify-center p-4 bg-blue-100 h-full rounded">
            <ControlButton icon={isWebcamOn ? 'fa-video' : 'fa-video-slash'} onClick={onWebcamClick} className={`mx-2 ${isWebcamOn?"":"bg-red-500 text-white"}`} label={"Cam"}/>
            <ControlButton icon={isAudioOn? 'fa-microphone' : 'fa-microphone-slash'} onClick={onAudioClick} className={`mx-2 ${isAudioOn?"":"bg-red-500 text-white"}`} label={"Mic"}/>
            <ControlButton icon={'fa-phone-slash'} onClick={onCallDisconnect} className={`mx-2`} label={"Leave"}/>
        </div>
    )
};