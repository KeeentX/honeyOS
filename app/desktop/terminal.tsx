import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';

export default function Terminal() {
    const [transcript, setTranscript] = useState<string>('Speak');

    useEffect(() => {
        const unlisten = listen<string>('transcribed_text', (event) => {
            setTranscript(event.payload);
        });

        return () => {
            unlisten.then((unlistenFn) => unlistenFn());
        };
    }, []);

    return (
        <div className="relative text-white ml-[5vw] mt-[5vh] w-[50vw]">
            <div className="absolute w-[45vw] h-[75vh] bg-black/40 blur-none backdrop-blur-sm top-0 -z-100">
                
            </div>
            <div className="relative blur-none relative z-20 p-[2vh] mr-[5vw] break-words ">
                {transcript}
            </div> 
        </div>
    );    
}
