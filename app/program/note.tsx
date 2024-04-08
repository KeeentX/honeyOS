import React from "react";
import WindowScreen from "@/app/desktop/components/window";

export default function Note({windowIndex, openedWindows, setOpenedWindows}: {
    windowIndex: number,
    openedWindows: React.JSX.Element[],
    setOpenedWindows: React.Dispatch<React.JSX.Element[]>,
}) {
    return (
        <WindowScreen name="NOTE" windowIndex={windowIndex} openedWindows={openedWindows} setOpenedWindows={setOpenedWindows}>
            <div className="p-4">
                <textarea className="text-white input input-bordered w-full max-w-xs" placeholder="Type something..." />
            </div>
        </WindowScreen>
    )
}