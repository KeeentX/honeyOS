import Note from "@/app/program/note";
import React from "react";
import {OpenedWindowsProps} from "@/app/types";
import Settings from "@/app/program/settings"
import FileManager from "@/app/program/file_manager";
import Camera from "@/app/program/camera";
import {Window} from "@/app/context/openedWindowsContext";
export function OpenNote(
    {openedWindows, setOpenedWindows}: OpenedWindowsProps,
    file?: {
        name: string,
        content: string,
        location: string
    }) {

    if(openedWindows[0].html) toggleMinimize(openedWindows, setOpenedWindows, 0);
    else openWindow(openedWindows, setOpenedWindows, 0, <Note windowIndex={0} file={file} />);
}

export function OpenSettings({openedWindows, setOpenedWindows}: OpenedWindowsProps) {
    if(openedWindows[1].html) toggleMinimize(openedWindows, setOpenedWindows, 1)
    else openWindow(openedWindows, setOpenedWindows, 1, <Settings windowIndex={1}/>);
}

export function OpenCamera({openedWindows, setOpenedWindows}: OpenedWindowsProps) {
    if(openedWindows[2].html) toggleMinimize(openedWindows, setOpenedWindows, 2)
    else openWindow(openedWindows, setOpenedWindows, 2, <Camera windowIndex={2}/>);
}
export function OpenFileManager({openedWindows, setOpenedWindows}: OpenedWindowsProps) {
    if(openedWindows[3].html) toggleMinimize(openedWindows, setOpenedWindows, 3)
    else openWindow(openedWindows, setOpenedWindows, 3, <FileManager windowIndex={3}/>);
}

const openWindow = (openedWindows: Window[], setOpenedWindows: React.Dispatch<React.SetStateAction<Window[]>>, index: number, html: React.JSX.Element) => {
    setOpenedWindows(prevState => {
        prevState[index].html = html;
        return [...prevState];
    })
    SetFocus(index, setOpenedWindows);
}

const toggleMinimize = (openedWindows: Window[], setOpenedWindows: React.Dispatch<React.SetStateAction<Window[]>>, index: number) => {
    if(openedWindows[index].minimized) {
        SetFocus(index, setOpenedWindows);
        setOpenedWindows(prevState => {
            prevState[index].minimized = false;
            return [...prevState];
        })
    } else {
        setOpenedWindows(prevState => {
            prevState[index].minimized = true;
            return [...prevState];
        })
    }
}

export const restoreWindow = (openedWindows: Window[], setOpenedWindows: React.Dispatch<React.SetStateAction<Window[]>>, index: number) => {
    setOpenedWindows(prevState => {
        prevState[index].maximized = false;
        prevState[index].minimized = false;
        return [...prevState];
    })
}

export const maximizeWindow = (openedWindows: Window[], setOpenedWindows: React.Dispatch<React.SetStateAction<Window[]>>, index: number) => {
    setOpenedWindows(prevState => {
        prevState[index].maximized = true;
        prevState[index].minimized = false;
        return [...prevState];
    })
}

export const minimizeWindow = (openedWindows: Window[], setOpenedWindows: React.Dispatch<React.SetStateAction<Window[]>>, index: number) => {
    setOpenedWindows(prevState => {
        prevState[index].minimized = true;
        prevState[index].maximized = false;
        return [...prevState];
    })
}

export const closeWindow = (openedWindows: Window[], setOpenedWindows: React.Dispatch<React.SetStateAction<Window[]>>, index: number) => {
    setOpenedWindows(prevState => {
        prevState[index].html = null;
        prevState[index].focused = false;
        prevState[index].minimized = false;
        prevState[index].maximized = false;
        return [...prevState];
    })

}

export function SetFocus(windowIndex: number, setOpenedWindows: React.Dispatch<React.SetStateAction<Window[]>>) {
    setOpenedWindows(prevState => {
        prevState.map((window, index) => {
            window.focused = index === windowIndex;
        });
        return [...prevState];
    })
}