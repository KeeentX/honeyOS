import WindowScreen from "../desktop/components/window";
import React, {useEffect} from "react";
import {WindowProps} from "@/app/types";
import {FaGear} from "react-icons/fa6";

export default function Settings({windowIndex}: WindowProps) {
    return (
        <WindowScreen name="Settings"
                      windowIndex={windowIndex}
                      icon={ <FaGear size={25} color={'yellow'}/>}
        >
            <div className="p-4">
                This is the settings
            </div>
        </WindowScreen>
    )
}