import React, { useEffect, useState, useRef } from 'react';
import Window from '../program/window';
import Voice from './voice';

export default function Taskbar() {
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [isNoteMinimized, setIsNoteMinimized] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isCameraMinimized, setIsCameraMinimized] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleOpenNote = () => {
        setIsNoteMinimized(false);
        setIsNoteOpen(true);
    };

    const handleCloseNote = () => {
        setIsNoteOpen(false);
        setIsNoteMinimized(false);
    };

    const handleMinimizeNote = () => {
        setIsNoteMinimized(true);
    };

    const handleOpenCamera = () => {
        setIsCameraMinimized(false);
        setIsCameraOpen(true);
        startCamera();
    };

    const handleCloseCamera = () => {
        setIsCameraOpen(false);
        setIsCameraMinimized(false);
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
    };    

    const handleMinimizeCamera = () => {
        setIsCameraMinimized(true);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    };
        
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();
            setCurrentTime(`${time}`);
            setCurrentDate(`${date}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-sm flex items-center justify-center font-consolas relative text-white w-[100vw] bg-primary/80 pl-[1vw] pr-[1vw] h-[6vh]">
            <div className="absolute right-0 pr-[1vw] ">
                {currentTime}<br></br>
                {currentDate}
            </div>

            <button
                className={`bg-primary h-[5vh] w-[5vh] ml-1 mr-1 rounded-lg ${isNoteMinimized ? 'border-white border-2 bg-transparent' : ''} ${isNoteOpen ? 'bg-red-500' : ''} `}
                onClick={handleOpenNote}
            >NOTE</button>
            {isNoteOpen && !isNoteMinimized && (
                <Window name="NOTE" onClose={handleCloseNote} onMinimize={handleMinimizeNote}>
                    <div className="p-4">
                        <input type="text" className="text-white input input-bordered w-full max-w-xs" placeholder="Type something..." />
                    </div>
                </Window>
            )}

            <button
                className={`bg-primary h-[5vh] w-[5vh] ml-1 mr-1 rounded-lg ${isCameraMinimized ? 'border-white border-2 bg-transparent' : ''} ${isCameraOpen ? 'bg-red-500' : ''} `}
                onClick={handleOpenCamera}
            >CAM</button>
            {isCameraOpen && !isCameraMinimized && (
                <Window name="CAMERA" onClose={handleCloseCamera} onMinimize={handleMinimizeCamera}>
                    <div className="p-4">
                        <video ref={videoRef} width="100%" height="auto" />
                    </div>
                </Window>
            )}
        </div>
    );
}
