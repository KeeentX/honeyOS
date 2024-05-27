import {useEffect, useState, useRef, useContext} from 'react';
import { Process, SchedulerContext } from "../context/schedulerContext";

const colorMap = {
    "Note": "#3B4163",
    "Settings" : "#346E82",
    "Camera": "#FFF5D1",
    "File Manager": "#F7CE72",
    "Spotify": "#F77269",
    "Chess": "#CF4F44"
}

export default function Voice() {
    const {
        readyProcesses,
        waitProcesses,       
    } = useContext(SchedulerContext);

    const [allProcesses, setAllProcesses] = useState<Process[]>([]);
    const [history, setHistory] = useState<String[]>([]);
    const [memoryMap, setMemoryMap] = useState<String[]>(new Array(20).fill(''));

    useEffect(() => {
        setAllProcesses([...readyProcesses, ...waitProcesses]);
    }, [readyProcesses, waitProcesses]);
    
    // HISTORY
    useEffect(() => {
        // Iterate through the readyProcesses
        readyProcesses.forEach((process: Process) => {
            // If the process is RUNNING and burstTime is greater than 0
            if(process.status === 2 && process.burstTime > 0) {
                // Add the process to the history
                if(!history.includes(process.name)){
                    setHistory((prev) => [...prev, process.name]);
                }else{
                    // If the process is already in the history, remove it
                    setHistory((prev) => prev.filter((name) => name !== process.name));
                    setHistory((prev) => [...prev, process.name]);
                }
            }
        })
        
        let allProcesses = readyProcesses.concat(waitProcesses);

        // Iterate through the history
        history.forEach((processName: String) => {
            // if the process is not in the readyProcesses or waitProcesses
            if(!allProcesses.some((process: Process) => process.name === processName)){
                // Remove the process from the history
                setHistory((prev) => prev.filter((name) => name !== processName));
            }
        })

    }, [allProcesses])

    // MEMORY MAP
    useEffect(() => {
        // Create a copy of memoryMap
        let updatedMemoryMap = [...memoryMap];

        // Iterate through the memoryMap
        updatedMemoryMap.forEach((page: String, index: number) => {
            // If the page is not in the allProcesses
            if(page != '' && !allProcesses.some((process: Process) => process.name === page)){
                // Set the page to empty
                updatedMemoryMap[index] = '';
            }
        })

        // Iterate through allProcesses
        allProcesses.forEach((process: Process) => {
            // get number of pages required
            let requiredNumPages = Math.ceil(process.memory / 50000);
            // get number of pages loaded
            let loadedNumPages = updatedMemoryMap.filter((page) => page === process.name).length;
            // get number of pages needed
            let neededNumPages = requiredNumPages - loadedNumPages;

            // First pass: loading memory on empty pages
            if(neededNumPages > 0){
                for(let i = 0; i < 20; i++){
                    if(updatedMemoryMap[i] === ''){
                        updatedMemoryMap[i] = process.name;
                        neededNumPages--;
                    }
                    if(neededNumPages === 0) break;
                }
            }

            // If the process is RUNNING and burstTime is greater than 0
            if (process.status === 2 && process.burstTime > 0) {
                // Second pass: loading pages on pages with old processes
                if(neededNumPages > 0){
                    // get the oldest process in the history
                    for(let i = 0; i < history.length; i++){
                        let oldProcessName = history[i];

                        // replace the pages
                        for(let j = 0; j < 20; j++){
                            if(updatedMemoryMap[j] === oldProcessName){
                                updatedMemoryMap[j] = process.name;
                                neededNumPages--;
                            }
                            if(neededNumPages === 0) break;
                        }
                        if(neededNumPages === 0) break;
                    }
                }
            }
        });

        // Update the memoryMap state with the new copy
        setMemoryMap(updatedMemoryMap);

    }, [allProcesses]);

    return (
        <div className="font-consolas relative text-white ml-[5vw] mt-[10vh] absolute w-[40vw] h-[25vh] 
        bg-black/40 blur-none backdrop-blur-sm top-0 -z-100 flex flex-col justify-between p-[2vh]">

            <div>
                VIRTUAL MEMORY MANAGEMENT
            </div>

            <div>
                HISTORY: {history.join(' -> ')}
            </div>

            <div className="flex justify-center">
                {memoryMap.map((processName, index) => (
                    <div
                        key={index}
                        className="inline-block h-[10vh] w-[1.5vw] mr-[2px]"
                        style={{
                            backgroundColor: processName ? colorMap[processName.toString() as keyof typeof colorMap] : 'transparent',
                            border: '1px solid white'
                        }}
                        title={processName ? processName.toString() : 'Empty Page'}
                    />
                ))}
            </div>

        </div>
    );
}
