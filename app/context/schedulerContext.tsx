'use client'

import React, {useState, createContext, Provider} from "react";

export type Process = {
    name: String;
    status: 0 | 1 | 2;
    bursttime: number;
    arrivaltime: number;
    priority: number;
    memory: number;
    isRunning: boolean;
}

export type SchedulerProviderProps = {
    processes: Process[];
    setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
    fifo: () => void
}

export const SchedulerContext = createContext<SchedulerProviderProps>({
    processes: [],
    setProcesses: () => {},
    fifo: () => {},
})


export default function SchedulerProvider({children}:{children: React.ReactNode}) {
    const [processes, setProcesses] = useState<Process[]>([]);
    const fifo = () : void => {
        let currentIndex = 0;
        setInterval(()=>{
            setProcesses(() => {
                processes[currentIndex].status = processes[currentIndex].status == 2 ? 1: processes[currentIndex].status == 1 ? 2 : 0;
                currentIndex = currentIndex == processes.length - 1 ? 0: currentIndex + 1;
                return processes
            })
        }, 1000)
    }

    return <SchedulerContext.Provider value={{processes, setProcesses, fifo}}>{children}</SchedulerContext.Provider>
}

