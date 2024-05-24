import {useContext, useEffect, useState} from "react";
import {OpenedWindowsContext} from "@/app/context/openedWindowsContext";
import { Process, SchedulerContext } from "../context/schedulerContext";
import { SchedulerProviderProps } from "../context/schedulerContext";

export default function Manager (){
    const {openedWindows, numberOfOpenedWindows} = useContext(OpenedWindowsContext);
    const {processes, setProcesses, FIFO} = useContext(SchedulerContext);

    useEffect(() => {
        if(processes.length === 0) return;
        const timer = FIFO(processes, -1, 0.5);

        return () => clearTimeout(timer);
    }, [numberOfOpenedWindows])

    return (
        <div className="font-consolas relative text-white ml-[5vw] mt-[5vh] w-[50vw]">
            <div className="absolute w-[40vw] h-[50vh] bg-black/40 blur-none backdrop-blur-sm top-0 -z-100">
                
            </div>
            <div className="blur-none p-[2vh] mr-[5vw] break-words ">
                TASK MANAGER <br/>
                <table className = "table-auto">
                    <tr>
                        <td>Priority</td>
                        <td>Process Name</td>
                        <td>Burst Time</td>
                        <td>Memory</td>
                        <td>Arrival Time</td>
                        <td>Status</td>
                    </tr>
                    {processes.map((process: Process, index: number) => {
                    return (
                        <tr key={index} className={`${process.status === 2 && 'bg-green-500'}`}>
                            <td>{process.priority}</td>
                            <td>{process.name}</td>
                            <td>{process.burstTime}</td>
                            <td>{process.memory} kb</td>
                            <td>{process.arrivalTime}</td>
                            <td>{process.status}</td>
                        </tr>
                    )
                    })}
                </table>

            </div>
        </div>
    )
}