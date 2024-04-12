import Note from "@/app/program/note";
import React from "react";
import {WindowProps} from "@/app/types";

export function OpenNote({appOpenedState, openedWindows, setOpenedWindows}: WindowProps) {
        if(appOpenedState.note) {
            openedWindows.map((window, index) => {
                if (index === appOpenedState.note - 1) {
                    if(document.getElementById(`window-${index}`)?.style.display === "block")
                        document.getElementById(`window-${index}`)?.style.setProperty("display", "none");
                    else
                        document.getElementById(`window-${index}`)?.style.setProperty("display", "block");
                }
            });
        } else {
            appOpenedState.note = openedWindows.length + 1;
            setOpenedWindows(
                [...openedWindows,
                    <Note
                        windowIndex={openedWindows.length}
                        openedWindows={openedWindows}
                        setOpenedWindows={setOpenedWindows}
                        appOpenedState={appOpenedState}
                    />])
        }
}