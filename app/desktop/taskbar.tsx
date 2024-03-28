import React, { useEffect, useState } from 'react';
import Window from '../program/window';
import Voice from './voice';

export default function Taskbar() {
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [isWindowMinimized, setIsWindowMinimized] = useState(false);

    const handleOpenWindow = () => {
        setIsWindowMinimized(false);
        setIsWindowOpen(true);
    };    

    const handleCloseWindow = () => {
        setIsWindowOpen(false);
        setIsWindowMinimized(false);
    };

    const handleMinimizeWindow = () => {
        setIsWindowMinimized(true);
    };

    // Update the current date and time every second
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();
            setCurrentTime(`${time}`);
            setCurrentDate(`${date}`)
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
                className={`bg-primary h-[5vh] w-[5vh] rounded-lg ${isWindowMinimized ? 'border-white border-2 bg-transparent' : ''} ${isWindowOpen ? 'bg-red-500' : ''} `}
                onClick={handleOpenWindow}
            >NOTE</button>
            {isWindowOpen && !isWindowMinimized && (
                <Window name="NOTE" onClose={handleCloseWindow} onMinimize={handleMinimizeWindow}>
                    <div className="p-4">
                        <input type="text" className="text-white input input-bordered w-full max-w-xs" placeholder="Type something..." />
                    </div>
                </Window>
            )}
        </div>
    );
}
