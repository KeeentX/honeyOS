import React, {useContext, useEffect, useState} from 'react';
import {OpenCamera, OpenFileManager, OpenNote, OpenSettings} from "@/app/desktop/programOpener";
import {FaGear, FaNoteSticky} from "react-icons/fa6";
import {OpenAppsContext} from "@/app/context/openedAppsContext";
import {FaCamera, FaFolder} from "react-icons/fa";
import {OpenedWindowsContext} from "@/app/context/openedWindowsContext";
import useFileSystem from "@/hooks/useFileSystem";

export default function Taskbar() {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const {note, camera, settings, fileManager, setAppOpenedState} = useContext(OpenAppsContext);
    const {openedWindows, setOpenedWindows} = useContext(OpenedWindowsContext);
    const {directory, honey_directory} = useFileSystem();
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
            className="text-sm flex items-center justify-center font-consolas space-x-1 text-white w-[100vw] bg-primary/80 h-[6vh]">
            <div className="absolute right-0 pr-[1vw] ">
                {currentTime}<br></br>
                {currentDate}
            </div>
            <div
                className={`p-3 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-300 
                rounded-md ${note ? 'bg-gray-700 ' : ''}
                `}
                onClick={() => OpenNote({
                    openedWindows,
                    setOpenedWindows,
                }, note, setAppOpenedState, {
                    name: "untitled.txt",
                    content: "",
                    location: directory(),
                })}>
                <FaNoteSticky size={30} color={'yellow'}/>
            </div>
            <div
                className={`p-3 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-300 
                rounded-md ${settings ? 'bg-gray-700 ' : ''}`}
                onClick={() => OpenSettings({
                    openedWindows,
                    setOpenedWindows,
                }, settings, setAppOpenedState)}>
                <FaGear size={30} color={'yellow'}/>
            </div>
            <div
                className={`p-3 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-300 
                rounded-md ${camera ? 'bg-gray-700 ' : ''}`}
                onClick={() => OpenCamera({
                    openedWindows,
                    setOpenedWindows,
                }, camera, setAppOpenedState)}>
                <FaCamera size={30} color={'yellow'}/>
            </div>
            <div
                className={`p-3 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-300
                rounded-md ${fileManager ? 'bg-gray-700 ' : ''}`}
                onClick={() => OpenFileManager({
                    openedWindows,
                    setOpenedWindows,
                }, fileManager, setAppOpenedState)}>
                <FaFolder size={30} color={'yellow'}/>
            </div>
        </div>
    );
}
