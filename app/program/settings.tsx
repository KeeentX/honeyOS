import WindowScreen from "../desktop/components/window";
import React from "react";

export default function Settings({windowIndex, openedWindows, setOpenedWindows}: {
    windowIndex: number,
    openedWindows: React.JSX.Element[],
    setOpenedWindows: React.Dispatch<React.JSX.Element[]>
}) {
    return (
        <WindowScreen name="SETTINGS" setOpenedWindows={setOpenedWindows} openedWindows={openedWindows} windowIndex={windowIndex}>
            <div className="p-4">
                This is the settings
            </div>
        </WindowScreen>
    )
}