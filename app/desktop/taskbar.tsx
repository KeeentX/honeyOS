import React, {Dispatch, ReactElement, SetStateAction, useEffect, useState} from 'react';
import Settings from "@/app/program/settings";
import Camera from "@/app/program/camera";
import FileManager from "@/app/program/file_manager";
import {WindowProps} from "@/app/types";
import {OpenNote} from "@/app/desktop/programOpener";
import {FaNoteSticky} from "react-icons/fa6";

export default function Taskbar({setOpenedWindows, openedWindows, appOpenedState}: WindowProps, openNote: () => void) {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
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
        <div
            className="text-sm flex items-center justify-center font-consolas text-white w-[100vw] bg-primary/80 h-[6vh]">
            <div className="absolute right-0 pr-[1vw] ">
                {currentTime}<br></br>
                {currentDate}
            </div>
            <div className={'p-3 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-300 rounded-md'}
                 onClick={() => OpenNote({appOpenedState, openedWindows, setOpenedWindows})}>
                <FaNoteSticky size={30} color={'yellow'}/>
            </div>
            <div className={'border p-3 cursor-pointer'}
                 onClick={() => setOpenedWindows(
                     [...openedWindows,
                         <Settings
                             windowIndex={openedWindows.length}
                             openedWindows={openedWindows}
                             setOpenedWindows={setOpenedWindows}
                         />])
                 }>
                Settings
            </div>
            <div className={'border p-3 cursor-pointer'}
                 onClick={() => setOpenedWindows(
                     [...openedWindows,
                         <Camera
                             windowIndex={openedWindows.length}
                             openedWindows={openedWindows}
                             setOpenedWindows={setOpenedWindows}
                         />])
                 }>
                Camera
            </div>
            <div className={'border p-3 cursor-pointer'}
                 onClick={() => setOpenedWindows(
                     [...openedWindows,
                         <FileManager
                             windowIndex={openedWindows.length}
                             openedWindows={openedWindows}
                             setOpenedWindows={setOpenedWindows}
                             appOpenedState={appOpenedState}
                         />])
                 }>
                File Manager
            </div>
        </div>
    );
}
