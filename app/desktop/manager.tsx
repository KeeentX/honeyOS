import { useDirectory } from "../directoryContext";

export default function Manager (){
    const { directory, setDirectory } = useDirectory();
    return (
        <div className="font-consolas relative text-white ml-[5vw] mt-[5vh] w-[50vw]">
            <div className="absolute w-[40vw] h-[50vh] bg-black/40 blur-none backdrop-blur-sm top-0 -z-100">
                
            </div>
            <div className="relative blur-none relative z-20 p-[2vh] mr-[5vw] break-words ">
                TASK MANAGER <br></br>
                {directory}
            </div> 
        </div>
    )
}