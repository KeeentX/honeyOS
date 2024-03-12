'use client'

import { useRouter } from "next/navigation"
import Image from "next/image";
import Terminal from "./terminal";

export default function Desktop() {
    const router = useRouter();
    return (
        <div className="w-[100vw] h-[100vh] relative">
            <div className="absolute w-full h-full -z-100">
                <Image 
                    src={'/wallpaper.png'} 
                    height={100} 
                    width={100}
                    className="w-full h-full"
                    alt="wallpaper" 
                />
            </div>
            {/* <Terminal/> */}
            <button onClick={router.back}>
                Logoff
            </button>
            
        </div>
    )
}