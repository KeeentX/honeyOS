import Window from "@/app/desktop/components/window";
import React, {useRef} from "react";
import Webcam from "react-webcam";

export default function Camera({windowIndex, openedWindows, setOpenedWindows}: {
    windowIndex: number,
    openedWindows: React.JSX.Element[],
    setOpenedWindows: React.Dispatch<React.JSX.Element[]>
}) {

    

const WebcamComponent = () => <Webcam />;

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
      };
      
    const videoRef = useRef<HTMLVideoElement>(null);
    return (
        <Window name="CAMERA" setOpenedWindows={setOpenedWindows} openedWindows={openedWindows} windowIndex={windowIndex}>
                <Webcam
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}>
            </Webcam>
        </Window>
        )
}