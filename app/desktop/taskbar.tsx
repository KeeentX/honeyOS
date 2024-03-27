import React, { useEffect, useState } from 'react';
import Window from '../program/window';
import Voice from './voice';

export default function Taskbar() {
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const handleOpenWindow = () => {
        setIsWindowOpen(true);
    };

    const handleCloseWindow = () => {
        setIsWindowOpen(false);
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

            <button className="btn" onClick={handleOpenWindow}>NOTE</button>
            {isWindowOpen && (
                <Window name="NOTE" onClose={handleCloseWindow}>
                    hi
                </Window>
            )}
        </div>
    );
}
