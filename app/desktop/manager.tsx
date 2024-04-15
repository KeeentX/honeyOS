import {useContext} from "react";
import {OpenedWindowsContext} from "@/app/context/openedWindowsContext";

export default function Manager (){
    const {openedWindows} = useContext(OpenedWindowsContext);


    return (
        <div className="font-consolas relative text-white ml-[5vw] mt-[5vh] w-[50vw]">
            <div className="absolute w-[40vw] h-[50vh] bg-black/40 blur-none backdrop-blur-sm top-0 -z-100">
                
            </div>
            <div className="blur-none p-[2vh] mr-[5vw] break-words ">
                TASK MANAGER <br/>
                {openedWindows.map((window, index) => {
                    return window.html &&
                        <div key={index}>{window.name}</div>
                })}
            </div>
        </div>
    )
}