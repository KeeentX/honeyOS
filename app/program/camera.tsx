import Window from "@/app/desktop/components/window";
import React, {useRef} from "react";
import Webcam from "react-webcam";
import {FaCamera} from "react-icons/fa";
import {WindowProps} from "@/app/types";

export default function Camera({windowIndex}: WindowProps) {
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
      };

    return (
        <Window
            name="Camera"
            windowIndex={windowIndex}
            icon={<FaCamera size={25} color={'yellow'}/>}>
            <Webcam
                audio={false}
                height={720}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints} />
        </Window>
        )
}