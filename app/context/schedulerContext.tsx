'use client'

import React, {createContext, useState} from "react";

export type Process = {
    name: String;
    status: 0 | 1 | 2;
    burstTime: number;
    arrivalTime: number;
    priority: number;
    memory: number;
}

export type SchedulerProviderProps = {
    processes: Process[];
    setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
    FIFO: (processes: Process[], processIndex: number, delay: number) => NodeJS.Timeout;
}

export const SchedulerContext = createContext<SchedulerProviderProps>({
    processes: [],
    setProcesses: () => {},
    FIFO: () => setTimeout(() => {}, 0)
})

export default function SchedulerProvider({children}:{children: React.ReactNode}) {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [currentCPUProcessIndex, setCurrentCPUProcessIndex] = useState<number>(0);

    const FIFO = (processes: Process[], processIndex: number, delay: number) => {
        const timer = setTimeout(() => {
            console.log(processes[processIndex], processIndex)
            if(processIndex == processes.length - 1) processIndex = 0;
            else processIndex += 1;
            setCurrentCPUProcessIndex(processIndex);
            setProcesses(prev => {
                return prev.map((process, index) => {
                    if(index === processIndex) process.status = 2;
                    else process.status = 1;
                    return process;
                })
            })
            clearTimeout(timer);
            FIFO(processes, processIndex, processes[processIndex].burstTime);
        }, delay * 1000)

        return timer;
    }

    return <SchedulerContext.Provider value={{processes, setProcesses, FIFO}}>{children}</SchedulerContext.Provider>
}

