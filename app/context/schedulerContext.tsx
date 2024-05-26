'use client'

import React, {createContext, useEffect, useRef, useState} from "react";

export type Process = {
    name: String;
    status: 0 | 1 | 2;
    burstTime: number;
    waitTime: number;
    arrivalTime: number;
    priority: number;
    memory: number;
}

export type SchedulerProviderProps = {
    readyProcesses: Process[],
    setReadyProcesses: React.Dispatch<React.SetStateAction<Process[]>>,
    waitProcesses: Process[],
    setWaitProcesses: React.Dispatch<React.SetStateAction<Process[]>>,
    FCFS: () => void,
    SJF: () => void,
    PRIORITY: () => void,
    ROUND_ROBIN: () => void,
    schedulerMode: 1 | 2 | 3 | 4,
    setSchedulerMode: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4>>,
    timer: React.MutableRefObject<NodeJS.Timeout | undefined>,
    readyRef: React.MutableRefObject<Process[]>,
    waitingRef: React.MutableRefObject<Process[]>,
    arrivalTime: number,
    setArrivalTime: React.Dispatch<React.SetStateAction<number>>,
    quantum: number,
    setQuantum: React.Dispatch<React.SetStateAction<number>>,
}

export const SchedulerContext = createContext<SchedulerProviderProps>({
    readyProcesses: [],
    setReadyProcesses: () => {},
    waitProcesses: [],
    setWaitProcesses: () => {},
    FCFS: () => setTimeout(() => {}, 0),
    SJF: () => setTimeout(() => {}, 0),
    PRIORITY: () => setTimeout(() => {}, 0),
    ROUND_ROBIN: () => setTimeout(() => {}, 0),
    schedulerMode: 1,
    setSchedulerMode: () => {},
    timer: {current: setTimeout(() => {}, 0)},
    readyRef: {current: []},
    waitingRef: {current: []},
    arrivalTime: 0,
    setArrivalTime: () => {},
    quantum: 0,
    setQuantum: () => {},
})

export default function SchedulerProvider({children}:{children: React.ReactNode}) {
    const [readyProcesses, setReadyProcesses] = useState<Process[]>([]);
    const [waitProcesses, setWaitProcesses] = useState<Process[]>([]);
    const currentCPUProcessIndex = useRef<number>(0);
    const [schedulerMode, setSchedulerMode] = useState<1 | 2 | 3 | 4>(1); // 0: FCFS, 1: SJF, 2: Priority, 3: Round Robin
    const timer = useRef<NodeJS.Timeout>();
    const readyRef = useRef<Process[]>(readyProcesses);
    const waitingRef = useRef<Process[]>(waitProcesses);
    const [arrivalTime, setArrivalTime] = useState(0);
    const [quantum, setQuantum] = useState(0);
    const quantumRef = useRef<number>(quantum);

    useEffect(() => {
        setInterval(() => {
            setArrivalTime(prev => prev + 0.1);
        }, 100);

        setQuantum(Math.random() * 10 % 5);
        quantumRef.current = quantum;
    }, []);

    useEffect(() => {
        if(readyRef.current.length !== readyProcesses.length) readyRef.current = readyProcesses;
    }, [readyProcesses]);

    useEffect(() => {
        if(waitingRef.current.length !== waitProcesses.length) waitingRef.current = waitProcesses;
    }, [waitProcesses]);

    function FCFS() {
        if(schedulerMode !== 1 && readyProcesses.length == 0) return clearInterval(timer.current);
        setReadyProcesses(prev => {
            return prev.map((process, index) => {
                if(index === currentCPUProcessIndex.current && process.status == 1) process.status = 2;
                return process;
            })
        })

        timer.current = setInterval(() => {
            setReadyProcesses(prevReady => {
                if(prevReady.length === 0) return [];
                if(prevReady[currentCPUProcessIndex.current].burstTime <= 0.1) {
                    prevReady[currentCPUProcessIndex.current].burstTime = 0;
                    prevReady[currentCPUProcessIndex.current].waitTime = Math.ceil((Math.random() * 10 % 8));
                    setWaitProcesses(prevWait => {
                        return [...prevWait, prevReady[currentCPUProcessIndex.current]];
                    })
                    const newPrevReady = prevReady.filter((_, index) => index !== currentCPUProcessIndex.current);
                    clearInterval(timer.current)
                    FCFS();
                    return [...newPrevReady];
                }
                prevReady[currentCPUProcessIndex.current].burstTime -= 0.1;
                return [...prevReady];
            })
        }, 100);
    }

    function SJF() {
        let shortestJobIndex = currentCPUProcessIndex.current;

        if(schedulerMode !== 2 && readyProcesses.length == 0) return clearInterval(timer.current);
        timer.current = setInterval(() => {
            setReadyProcesses(prevReady => {
                if(prevReady.length === 0) return [];
                if(prevReady[shortestJobIndex] == null) return prevReady;
                if(prevReady[shortestJobIndex].burstTime <= 0.1) {
                    prevReady[shortestJobIndex].burstTime = 0;
                    prevReady[shortestJobIndex].waitTime = Math.ceil((Math.random() * 10 % 8));
                    setWaitProcesses(prevWait => {
                        return [...prevWait, prevReady[shortestJobIndex]];
                    })
                    const newPrevReady = prevReady.filter((_, index) => index !== shortestJobIndex);
                    clearInterval(timer.current)
                    SJF();
                    return [...newPrevReady];
                }

                // Find the process with the shortest burst time
                readyRef.current.forEach((process, index) => {
                    if(process.burstTime < readyRef.current[shortestJobIndex].burstTime) {
                        shortestJobIndex = index;
                    }
                })

                setReadyProcesses(prev => {
                    return prev.map((process, index) => {
                        process.status = 1;
                        if(index == shortestJobIndex && process.status == 1) process.status = 2;
                        return process;
                    })
                })

                prevReady[shortestJobIndex].burstTime -= 0.1;
                return [...prevReady];
            })
        }, 100);
    }

    function PRIORITY() {
        let mostPriority = currentCPUProcessIndex.current;
        if(schedulerMode !== 2 && readyProcesses.length == 0) return clearInterval(timer.current);

        timer.current = setInterval(() => {
            setReadyProcesses(prevReady => {
                if(prevReady.length === 0) return [];
                if(prevReady[mostPriority] == null) return prevReady;
                if(prevReady[mostPriority].burstTime <= 0.1) {
                    prevReady[mostPriority].burstTime = 0;
                    prevReady[mostPriority].waitTime = Math.ceil((Math.random() * 10 % 8));
                    setWaitProcesses(prevWait => {
                        return [...prevWait, prevReady[mostPriority]];
                    })
                    const newPrevReady = prevReady.filter((_, index) => index !== mostPriority);
                    clearInterval(timer.current)
                    PRIORITY();
                    return [...newPrevReady];
                }

                readyRef.current.forEach((process, index) => {
                    if(process.priority < readyRef.current[mostPriority].priority) {
                        mostPriority = index;
                    }
                })

                // Find the process with the most priority

                setReadyProcesses(prev => {
                    return prev.map((process, index) => {
                        process.status = 1;
                        if(index == mostPriority && process.status == 1) process.status = 2;
                        return process;
                    })
                })
                prevReady[mostPriority].burstTime -= 0.1;
                return [...prevReady];
            })
        }, 100);
    }

    function ROUND_ROBIN() {
        let quantumRemaining = 2;
        if(schedulerMode !== 1 && readyProcesses.length == 0) return clearInterval(timer.current);

        setReadyProcesses(prev => {
            return prev.map((process, index) => {
                if(index === currentCPUProcessIndex.current && process.status == 1) process.status = 2;
                return process;
            })
        })

        timer.current = setInterval(() => {
            setReadyProcesses(prevReady => {
                if(prevReady.length === 0) {
                    currentCPUProcessIndex.current = 0;
                    return [];
                }
                if(prevReady[currentCPUProcessIndex.current] == null) return prevReady;

                if(prevReady[currentCPUProcessIndex.current].burstTime <= 0.1) {
                    prevReady[currentCPUProcessIndex.current].burstTime = 0;
                    prevReady[currentCPUProcessIndex.current].waitTime = Math.ceil((Math.random() * 10 % 8));
                    setWaitProcesses(prevWait => {
                        return [...prevWait, prevReady[currentCPUProcessIndex.current]];
                    });
                    const newPrevReady = prevReady.filter((_, index) => index !== currentCPUProcessIndex.current);
                    clearInterval(timer.current)
                    if(currentCPUProcessIndex.current === prevReady.length - 1) currentCPUProcessIndex.current = 0;
                    ROUND_ROBIN();
                    return [...newPrevReady];
                }

                if(quantumRemaining <= 0.1) {
                    console.log('Quantum Remaining:', quantumRemaining);
                    currentCPUProcessIndex.current = (currentCPUProcessIndex.current + 1) % prevReady.length;
                    clearInterval(timer.current);
                    ROUND_ROBIN();
                    return prevReady.map((process, index) => {
                        if(index === currentCPUProcessIndex.current - 1) process.burstTime -= 0.1;
                        process.status = 1;
                        return process;
                    })
                }
                prevReady[currentCPUProcessIndex.current].burstTime -= 0.1;
                quantumRemaining -= 0.1;
                return [...prevReady];
            })
        }, 100);
    }

    return <SchedulerContext.Provider value={{
        readyProcesses,
        setReadyProcesses,
        waitProcesses,
        setWaitProcesses,
        FCFS,
        SJF,
        PRIORITY,
        ROUND_ROBIN,
        schedulerMode,
        setSchedulerMode,
        timer,
        readyRef,
        waitingRef,
        arrivalTime,
        setArrivalTime,
        quantum,
        setQuantum,
    }}>{children}</SchedulerContext.Provider>
}

