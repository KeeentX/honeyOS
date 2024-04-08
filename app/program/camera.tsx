import Window from "@/app/desktop/components/window";
import React, {useRef} from "react";

export default function Camera({windowIndex, openedWindows, setOpenedWindows}: {
    windowIndex: number,
    openedWindows: React.JSX.Element[],
    setOpenedWindows: React.Dispatch<React.JSX.Element[]>
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    return (
        <Window name="CAMERA" setOpenedWindows={setOpenedWindows} openedWindows={openedWindows} windowIndex={windowIndex}>
            <div className="p-4">
                <video ref={videoRef} width="100%" height="auto"/>
            </div>
        </Window>
        )
}