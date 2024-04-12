import React from "react";
import WindowScreen from "@/app/desktop/components/window";
import {WindowProps} from "@/app/types";

export default function Note({windowIndex, openedWindows, setOpenedWindows, appOpenedState, setAppOpenedState}: WindowProps) {
    return (
        <WindowScreen name="note"
                      windowIndex={windowIndex}
                      openedWindows={openedWindows}
                      setOpenedWindows={setOpenedWindows}
                      appOpenedState={appOpenedState}
                      setAppOpenedState={setAppOpenedState}>
            <div className="h-full w-full">
                <textarea className="text-white input w-full h-full" placeholder="Type something..." />
            </div>
        </WindowScreen>
    )
}