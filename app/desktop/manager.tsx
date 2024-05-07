import {useContext, useEffect, useState} from "react";
import {OpenedWindowsContext} from "@/app/context/openedWindowsContext";
import { Process, SchedulerContext } from "../context/schedulerContext";
import { SchedulerProviderProps } from "../context/schedulerContext";

export default function Manager (){
    const {openedWindows} = useContext(OpenedWindowsContext);
    const {processes, setProcesses, fifo} = useContext(SchedulerContext);
    const [schedulerSet, setSchedulerSet] = useState(false);

    useEffect(() => {
        setProcesses(() => {
            const newProcesses : Process[] = [];
            openedWindows.map((window, index) => {
                window.html && newProcesses.push({
                    name: window.name,
                    status: 0,
                    bursttime: processes[index] && processes[index].bursttime ? processes[index].bursttime : Math.ceil((Math.random() * 10 % 3)),
                    arrivaltime: 0,
                    priority: 0,
                    memory: processes[index] && processes[index].memory ? processes[index].memory: Math.ceil((Math.random() * 1000)),
                })
            })

            return newProcesses;
        })
        
    },[openedWindows])

    useEffect(() =>{
        if(!schedulerSet && processes.length) {
            fifo();
            setSchedulerSet(true); 
        }
    }, [processes])

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
                    return <tr key={index}>
                    <td>{process.priority}</td>
                    <td>{process.name}</td>
                    <td>{process.bursttime}</td>
                    <td>{process.memory} kb</td>
                    <td>{process.arrivaltime}</td>
                    <td>{process.status}</td>
                    </tr>
                })}
                </table>
                
            </div>
        </div>
    )
}