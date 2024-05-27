import {useContext, useEffect, useState} from "react";
import {OpenedWindowsContext} from "@/app/context/openedWindowsContext";
import { Process, SchedulerContext } from "../context/schedulerContext";
import { SchedulerProviderProps } from "../context/schedulerContext";
import useFont from "@/hooks/useFont";

export default function Manager (){
    const {
        readyProcesses, setReadyProcesses,
        waitProcesses,
        FCFS,
        SJF,
        PRIORITY,
        ROUND_ROBIN,
        schedulerMode,
        timer,
        setSchedulerMode,
        arrivalTime,
        quantum
    } = useContext(SchedulerContext);

    useEffect(() => {
        setReadyProcesses((prev) => {
            prev.forEach((process) => {
                process.status = 1;
            })
            return prev;
        })
        if(schedulerMode === 1) FCFS();
        else if(schedulerMode === 2) SJF();
        else if(schedulerMode === 3) PRIORITY();
        else if(schedulerMode === 4) ROUND_ROBIN();

        return () => clearInterval(timer.current);

    }, [schedulerMode])

    return (
        <div className={`font-consolas relative text-white ml-[5vw] mt-[5vh] bg-black/40 blur-none backdrop-blur-sm w-[40vw] h-[50vh]`}>
            <div className="blur-none p-[2vh] mr-[5vw] break-words ">
                TASK MANAGER {arrivalTime.toFixed(2)} <br/>
                <div className={'flex flex-row space-x-1'}>
                    <button
                        className={`${schedulerMode == 1 ? 'bg-yellow-300/50' : 'bg-indigo-400/50'} px-6 py-0.5 rounded-full`}
                        onClick={() => {
                            setSchedulerMode(1);
                        }}>
                        FCFS
                    </button>
                    <button
                        className={`${schedulerMode == 2 ? 'bg-yellow-300/50' : 'bg-indigo-400/50'} px-6 py-0.5 rounded-full`}
                        onClick={() => {
                            setSchedulerMode(2);
                        }}>
                        SJF
                    </button>
                    <button
                        className={`${schedulerMode == 3 ? 'bg-yellow-300/50' : 'bg-indigo-400/50'} px-6 py-0.5 rounded-full`}
                        onClick={() => setSchedulerMode(3)}>
                        PRIORITY
                    </button>
                    <button
                        className={`${schedulerMode == 4 ? 'bg-yellow-300/50' : 'bg-indigo-400/50'} px-6 py-0.5 rounded-full`}
                        onClick={() => setSchedulerMode(4)}>
                        ROUND ROBIN Q={quantum.toFixed(1)}
                    </button>
                </div>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <td>Process ID</td>
                            <td>Priority</td>
                            <td>Process Name</td>
                            <td>Burst Time</td>
                            <td>Memory</td>
                            <td>Arrival Time</td>
                            <td>Status</td>
                        </tr>
                    </thead>
                    {readyProcesses && readyProcesses.map((process: Process, index: number) => {
                    return (
                        <tr key={index} className={`${process.status === 2 && 'bg-green-500'}`}>
                            <td>77HYH</td>
                            <td>{process.priority}</td>
                            <td>{process.name}</td>
                            <td>{process.burstTime.toFixed(2)}s</td>
                            <td>{process.memory / 1000}MB</td>
                            <td>{process.arrivalTime.toFixed(2)}</td>
                            <td>{process.status == 1 ? 'Ready' : 'Running'}</td>
                        </tr>
                    )
                    })}
                </table>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Wait Process</td>
                            <td>Waiting Time</td>
                            <td>Memory</td>
                            <td>Status</td>
                        </tr>
                    </thead>
                    {waitProcesses.map((process: Process, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{process.name}</td>
                                <td>I/O</td>
                                <td>{process.waitTime.toFixed(2)}s</td>
                                <td>{process.memory}kb</td>
                                <td>Waiting</td>
                            </tr>
                    )
                })}
                </table>
            </div>
        </div>
    )
}