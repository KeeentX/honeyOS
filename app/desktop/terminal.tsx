import { useState, useRef, useEffect } from "react";
import { useDirectory } from "../directoryContext";
import { invoke } from '@tauri-apps/api/tauri';
import { app } from "@tauri-apps/api";


export default function Terminal() {
    const { directory } = useDirectory();
    const [modifiedDirectory, setModifiedDirectory] = useState(directory.replace("honey\\root", ""));
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const [oldText, setOldText] = useState("");
    const hasRunOnceRef = useRef(false);

async function appendSystemInfoToTerminal() {
    try {
        const systemInfo = await invoke('get_system_info');
        const { cpu_name, cpu_speed, ram, disk } = JSON.parse(systemInfo);
        const diskInGB = (disk / (1024 * 1024)).toFixed(2);
        const ramInGB = (ram / (1024 * 1024 * 1024)).toFixed(2);

        let asciiArt = `
               @@@@@                          JOI
            @@@/*...@@@/                      ------------------
   @@@@@@@@@@/........,@@                     OS: Honey x86_64
 @@@.      .@@@///......@@       @@@@         CPU: ${cpu_name}
@@..          @@@///....@@@     @@@@@    %    Speed: ${cpu_speed} MHz
@@.......       @@@//....@@    @@     @@@@@   Disk: ${diskInGB} GB
@@.........      @@@//..@@(  @@   @@@         RAM: ${ramInGB} GB
@@@..........     @@//.&@@  @@&/@@                      
   @@@@@@@*.........   @@@/#@@@@. @@@@                   
        @@@@@........  @@@@ ,,,,,,,,, @@                  
             %@@@@@,... @@@/,,,,@  @,,,@@                 
          @@@@@@@,,,@@@@@@@//,,,,@&,,,/@@                 
        @@@ .@@@@,,,(@@@@&@@//////////@@                  
      @@@&,,,@@@@,,,,@@@@@/%@@@@@@@@@@                    
     @@@@@,,,,@@@@,,,,,@@@@@(/@@                          
    @@ @@@&,,,,@@@@@/////@@@@@@                           
   @@@,%@@@@////#@@@@@///@@@/                             
   @@@@@@@@@@@@/////@@@@@@                                 
         /@@@@@@@@@@                                      
        `;

        appendToTerminal(asciiArt);
    } catch (error) {
        console.error('Failed to fetch system info:', error);
    }
}

    useEffect(() => {
        if (!hasRunOnceRef.current) {
            appendSystemInfoToTerminal();
            hasRunOnceRef.current = true;
        }
        
        if (terminalRef.current) {
            terminalRef.current.addEventListener("click", focusInput);
        }

        return () => {
            if (terminalRef.current) {
                terminalRef.current.removeEventListener("click", focusInput);
            }
        };
    }, []);

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            moveCursorToEnd();
        }
    };

    const moveCursorToEnd = () => {
        if (inputRef.current) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(inputRef.current);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
        
            // Execute command, clear the input and append the user input to the terminal
            if (inputRef.current) {
                const userInput: string = inputRef.current.innerText.trim();
                appendToTerminal(`${modifiedDirectory}${'>'}${userInput}`);
                inputRef.current.innerText = ""; // Clear the input
                moveCursorToEnd(); // Move the cursor to the end
                executeCommand(userInput);
            }
        }
    };

    function appendToTerminal(text: string) {
        setOldText((prev: string) => prev === "" ? text : `${prev}\n${text}`);
    }
    

    function executeCommand(command: string) {
        const commandParts = command.split(" ");

        switch (commandParts[0]) {
            case "clear":
                if(commandParts.length > 1) {
                    appendToTerminal("clear: too many arguments");
                }else{
                    setOldText("");
                }
                break;
            case "":
                if(commandParts.length > 1) {

                }

                break;
            case "fetch":
                if(commandParts.length > 1) {
                    appendToTerminal("fetch: too many arguments");
                }else{
                    // appendToTerminal(asciiArt);
                    appendSystemInfoToTerminal();
                }
                break;
            default:
                appendToTerminal(`'${commandParts[0]}' is not recognized as an internal or external command, operable program or file.`);
                break;
        }
    }

    return (
        <div className="relative text-white ml-[5vw] mt-[5vh] w-[50vw] text-sm" ref={terminalRef}>
            <div className="absolute w-[45vw] h-[80vh] bg-black/40 blur-none backdrop-blur-sm top-0 -z-100"></div>
            <div className="relative blur-none relative z-20 p-[2vh] mr-[5vw] break-words outline-none select-none cursor-text h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="text-green-400 whitespace-pre" dangerouslySetInnerHTML={{ __html: oldText.replace(/\n/g, '<br>') }}></div>
                <div className="flex items-center w-[40vw]">
                    <span className="pointer-events-none">{modifiedDirectory}{'>'}</span>
                    <span
                        ref={inputRef}
                        className="outline-none select-text cursor-text flex-1 whitespace-pre-wrap break-words w-[30vw]"
                        contentEditable
                        onKeyDown={handleKeyDown}
                        suppressContentEditableWarning={true}
                    ></span>
                </div>
            </div>
        </div>
    );
}
