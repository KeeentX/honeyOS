'use client'

import { useRouter } from "next/navigation"
import Image from "next/image";
import Terminal from "./terminal";
import Manager from "./manager";
import Voice from "./voice";

export default function Desktop() {
    const router = useRouter();
    return (
        <div className="font-consolas w-[100vw] h-[100vh] relative overflow-hidden">
            <div className="absolute w-full h-full -z-100">
                <Image 
                    src={'/wallpaper.png'} 
                    height={100} 
                    width={100}
                    className="w-full h-full"
                    alt="wallpaper" 
                />
            </div>
            <div className="grid grid-cols-2 grid-rows-2 h-[100vh]">
                <div className="col-span-1 row-span-2">
                    <Terminal/>
                </div>
                <div className="col-start-2 row-span-1">
                    <Manager/>
                </div>
                <div className="col-start-2 row-start-2">
                    <Voice/>
                </div>
            </div>            
        </div>
    )
}