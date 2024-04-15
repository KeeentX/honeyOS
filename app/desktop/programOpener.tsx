import Note from "@/app/program/note";
import React from "react";
import {OpenedWindowsProps, WindowProps} from "@/app/types";
import Settings from "@/app/program/settings";
import {AppOpenedProps} from "@/app/context/openedAppsContext";
import FileManager from "@/app/program/file_manager";
import Camera from "@/app/program/camera";
export function OpenNote(
    {openedWindows, setOpenedWindows}: OpenedWindowsProps,
    note: number,
    setAppOpenedState: Function,
    file?: {
        name: string,
        content: string,
        location: string
    }) {
    // For minimizing and maximizing the window
    if(note) {
        if(file === undefined) {
            openedWindows.map((window, index) => {
                if (index === note - 1) {
                    if(document.getElementById(`window${note}`)?.style.display === "block")
                        document.getElementById(`window${note}`)?.style.setProperty("display", "none");
                    else
                        document.getElementById(`window${note}`)?.style.setProperty("display", "block");
                }
            });
        } else {
            // Close the current note window

            // Open the new note window with the file content
        }
    }

    // For opening the window if not yet opened
    else {
        setAppOpenedState((prevState: AppOpenedProps) => {
            return {
                ...prevState,
                note: openedWindows.length + 1,
            }
        });
        SetFocus("note", setAppOpenedState);
        setOpenedWindows(
            [...openedWindows,
                <Note
                    windowIndex={openedWindows.length + 1}
                    file={file}
                />])
    }
}

export function OpenSettings({openedWindows, setOpenedWindows}: OpenedWindowsProps, settings: number, setAppOpenedState: Function) {
    // For minimizing and maximizing the window
    if(settings) {
        openedWindows.map((window, index) => {
            if (index === settings - 1) {
                if(document.getElementById(`window${settings}`)?.style.display === "block")
                    document.getElementById(`window${settings}`)?.style.setProperty("display", "none");
                else
                    document.getElementById(`window${settings}`)?.style.setProperty("display", "block");
            }
        });
    }

    // For opening the window if not yet opened
    else {
        setAppOpenedState((prevState: AppOpenedProps) => {
            return {
                ...prevState,
                settings: openedWindows.length + 1
            }
        });
        SetFocus("Settings", setAppOpenedState);
        setOpenedWindows(
            [...openedWindows,
                <Settings
                    windowIndex={openedWindows.length + 1}
                />])
    }
}

export function OpenFileManager({openedWindows, setOpenedWindows}: OpenedWindowsProps, fileManager: number, setAppOpenedState: Function) {
    // For minimizing and maximizing the window
    if(fileManager) {
        openedWindows.map((window, index) => {
            if (index === fileManager - 1) {
                if(document.getElementById(`window${fileManager}`)?.style.display === "block")
                    document.getElementById(`window${fileManager}`)?.style.setProperty("display", "none");
                else
                    document.getElementById(`window${fileManager}`)?.style.setProperty("display", "block");
            }
        });
    }

    // For opening the window if not yet opened
    else {
        setAppOpenedState((prevState: AppOpenedProps) => {
            return {
                ...prevState,
                fileManager: openedWindows.length + 1
            }
        });
        SetFocus("File Manager", setAppOpenedState);
        setOpenedWindows(
            [...openedWindows,
                <FileManager
                    windowIndex={openedWindows.length + 1}
                />])
    }
}

export function OpenCamera({openedWindows, setOpenedWindows}: OpenedWindowsProps, camera: number, setAppOpenedState: Function) {
    // For minimizing and maximizing the window
    if(camera) {
        openedWindows.map((window, index) => {
            if (index === camera - 1) {
                if(document.getElementById(`window${camera}`)?.style.display === "block")
                    document.getElementById(`window${camera}`)?.style.setProperty("display", "none");
                else
                    document.getElementById(`window${camera}`)?.style.setProperty("display", "block");
            }
        });
    }

    // For opening the window if not yet opened
    else {
        setAppOpenedState((prevState: AppOpenedProps) => {
            return {
                ...prevState,
                camera: openedWindows.length + 1
            }
        });
        SetFocus("camera", setAppOpenedState)
        setOpenedWindows(
            [...openedWindows,
                <Camera
                    windowIndex={openedWindows.length + 1}
                />])
    }
}

export function SetFocus(name: String, setAppOpenedState: Function) {
    setAppOpenedState((prevState: AppOpenedProps) => {
        return {
            ...prevState,
            isNoteFocused: name === "Note" || name === "note",
            isSettingsFocused: name === "Settings" || name === "settings",
            isCameraFocused: name === "Camera" || name === "camera",
            isFileManagerFocused: name === "File Manager" || name === "file_manager"
        }
    })
}