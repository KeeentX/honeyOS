'use client'

import { useRouter } from "next/navigation"
import Image from "next/image";
import Terminal from "./terminal";
import Manager from "./manager";
import Voice from "./voice";
import Taskbar from "./taskbar";
import React, {useEffect, useState} from "react";
import WindowScreen from "@/app/desktop/components/window";
import Note from "@/app/program/note";

export default function Desktop() {
    const [openedWindows, setOpenedWindows] = useState<React.JSX.Element[]>([]);
    const [appOpenedState, setAppOpenedState] = useState({
        note: 0,
        settings: 0,
        camera: 0,
        fileManager: 0
    });
    useEffect(() => {
        console.log(openedWindows)
    }, [openedWindows]);
    return (
        <div className="font-consolas relative">
            <div className="absolute w-full h-full -z-100">
                <Image 
                    src={'/wallpaper.png'} 
                    height={100} 
                    width={100}
                    className="w-full h-full"
                    alt="wallpaper" 
                />
            </div>
            <Taskbar
                setOpenedWindows={setOpenedWindows}
                openedWindows={openedWindows}
                appOpenedState={appOpenedState}
                setAppOpenedState={setAppOpenedState}
            />
            <div className="grid grid-cols-2 grid-rows-2 h-[100vh]">
                <div className="col-span-1 row-span-2">
                    <Terminal
                        setOpenedWindows={setOpenedWindows}
                        openedWindows={openedWindows}
                        appOpenedState={appOpenedState}
                        setAppOpenedState={setAppOpenedState}/>
                </div>
                <div className="col-start-2 row-span-1">
                    <Manager/>
                </div>
                <div className="col-start-2 row-start-2">
                    <Voice/>
                </div>
            </div>

            {openedWindows.map((window, index) => window)}
        </div>
    )
}