import React, {Dispatch, ReactElement, SetStateAction, useEffect, useState} from 'react';
import Note from "@/app/program/note";
import Settings from "@/app/program/settings";
import Camera from "@/app/program/camera";
import FileManager from "@/app/program/file_manager";
import {WindowProps} from "@/app/types";
import {OpenNote} from "@/app/desktop/programOpener";

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
            className="text-sm flex items-center justify-center font-consolas absolute top-0 text-white w-[100vw] bg-primary/80 pl-[1vw] pr-[1vw] h-[6vh]">
            <div className="absolute right-0 pr-[1vw] ">
                {currentTime}<br></br>
                {currentDate}
            </div>
            <div className={'border p-3 cursor-pointer'}
                 onClick={() => OpenNote({appOpenedState, openedWindows, setOpenedWindows})}>
                Note
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
                         />])
                 }>
                File Manager
            </div>
        </div>
    );
}
