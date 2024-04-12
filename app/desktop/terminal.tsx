import React, { useState, useRef, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import useFileSystem from "@/hooks/useFileSystem";
import {FileProps, WindowProps} from "@/app/types";
import Note from "@/app/program/note";
import Settings from "@/app/program/settings";
import Camera from "@/app/program/camera";
import FileManager from "@/app/program/file_manager";
import {OpenNote} from "@/app/desktop/programOpener";

export default function Terminal({setOpenedWindows, openedWindows, appOpenedState}: WindowProps) {
    const {directory, setDirectory, honey_directory, exitCurrentDir, listDir} = useFileSystem();
    // const [modifiedDirectory, setModifiedDirectory] = useState(directory.replace("C:\\honey\\root", "C:\\"));
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [oldText, setOldText] = useState("");
    const hasRunOnceRef = useRef(false);
    const voices = useRef<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (!hasRunOnceRef.current) {
            hasRunOnceRef.current = true;
            appendSystemInfoToTerminal();
        }

        // Fetch voices
        const voiceTimer = setInterval(() => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length !== 0) {
                voices.current = availableVoices;
                clearInterval(voiceTimer);
            }
        }, 200);

        // TRANSCRIPTION
        const unlisten = listen<string>('transcribed_text', (event) => {
            const [isCommandValid, command] = isCommand(event.payload);
            if(isCommandValid){
                appendToTerminal(`${'honeyos' + honey_directory()}${'>'}${command}`);
                executeCommand(command);
            }
        });

        if (terminalRef.current) {
            (terminalRef.current as HTMLElement).addEventListener("click", focusInput);
        }

        return () => {
            if (terminalRef.current) {
                (terminalRef.current as HTMLElement).removeEventListener("click", focusInput);
            }
        };
    }, []);

    function isCommand(transcript: string): [boolean, string] {
        const trimmedTranscript = transcript.trim().toLowerCase().replace(/[^\w\s]/gi, '');
        const startsWithHoney = trimmedTranscript.startsWith('honey');
        const endsWithPlease = trimmedTranscript.endsWith('please');
    
        if (startsWithHoney && endsWithPlease) {
            const command = trimmedTranscript.slice(5, -6).trim();
            if(command === "open file manager") return [true, "open file_manager"];
            return [true, command];
        }
        return [false, ''];
    }

    function speak(text: string) {
        if(voices.current.length !== 0){
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voices.current[2];
            console.log(voices);
            window.speechSynthesis.speak(utterance);
        }  
    }

    /*------------------------------------------------------------------------------------------------------------*/
    // TERMINAL FUNCTIONS
    /*------------------------------------------------------------------------------------------------------------*/

    /*
        FETCH
        - Fetches the system information and appends it to the terminal
    */
    async function appendSystemInfoToTerminal() {
        try {
            const systemInfo = await invoke('get_system_info') as string;
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
            const speechText = `JOI, OS: Honey x86_64 CPU: ${cpu_name}, Speed: ${cpu_speed} MHz, Disk: ${diskInGB} GB, RAM: ${ramInGB} GB`;
            speak(speechText);
        } catch (error) {
            console.error('Failed to fetch system info:', error);
        }
    }

    /*
        LIST
        - Lists the files in the current directory
    */
    async function listCurrentDirectory() {
        try {
            appendToTerminal(`\nDirectory of ${'honeyos' + honey_directory()}\n`);
            const files2 = await listDir();
            files2.map(file => {
                appendToTerminal(`${file.mtime}    ${file.size}    ${file.name}`);
            })
        } catch (error) {
            appendToTerminal(`Error listing directory: ${error}`);
            console.log(error);
        }
    }   

    /*
        ENTER [directory]
        - Enters a directory
    */
    async function enterDirectory(dir: string) {
        try {
            const newDirectory = `${honey_directory()}\\${dir}`;
            const files: Array<FileProps> = await invoke('list_directory_with_times', { path: directory() + newDirectory });
            setDirectory(newDirectory);
        } catch (error) {
            appendToTerminal(`Error entering directory: ${error}`);
            console.log(error);
        }
    }

    /*
        EXIT
        - Exits the current directory
    */
    async function exitDirectory() {
        try {
            // Check if the current directory is the root directory
            if (directory().length === 0) return;
            exitCurrentDir();
        } catch (error) {
            appendToTerminal(`Error exiting directory: ${error}`);
            console.log(error);
        }
    }

    /*
        OPEN [program]
        - Opens a program
    */
    async function openProgram(program: string) {
        switch (program) {
            case "note":
                OpenNote({appOpenedState, openedWindows, setOpenedWindows});
                break;
            case "settings":
                setOpenedWindows(
                    [...openedWindows,
                        <Settings windowIndex={openedWindows.length} openedWindows={openedWindows} setOpenedWindows={setOpenedWindows}  />]
                );
                break;
            case "camera":
                setOpenedWindows(
                    [...openedWindows,
                        <Camera windowIndex={openedWindows.length} openedWindows={openedWindows} setOpenedWindows={setOpenedWindows}  />]
                );
                break;
            case "file_manager":
                setOpenedWindows(
                    [...openedWindows,
                        <FileManager windowIndex={openedWindows.length} openedWindows={openedWindows} setOpenedWindows={setOpenedWindows}  />]
                );

        }
    }
    
    /*------------------------------------------------------------------------------------------------------------*/

    const focusInput = () => {
        if (inputRef.current) {
            (inputRef.current as HTMLSpanElement).focus();
            moveCursorToEnd();
        }
    };

    const moveCursorToEnd = () => {
        if (inputRef.current) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(inputRef.current);
            range.collapse(false);
            if(sel){
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
        
            // Execute command, clear the input and append the user input to the terminal
            if (inputRef.current) {
                const userInput: string = (inputRef.current as HTMLSpanElement).innerText.trim();
                // appendToTerminal(`${modifiedDirectory}${'>'}${userInput}`);
                (inputRef.current as HTMLSpanElement).innerText = ""; // Clear the input
                moveCursorToEnd(); // Move the cursor to the end
                executeCommand(userInput);
            }
        }
    };

    function appendToTerminal(text: string) {
        setOldText((prev: string) => prev === "" ? text : `${prev}\n${text}`);
    }

    async function executeCommand(command: string) {
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
                break;
            case "list":
                if(commandParts.length > 1){
                    appendToTerminal("list: too many arguments");
                }else{
                    listCurrentDirectory();
                }

                break;
            case "enter":
                if(commandParts.length < 2){
                    appendToTerminal("enter: too few arguments");
                }else if (commandParts.length > 2){
                    appendToTerminal("enter: too many arguments");
                }else{
                    enterDirectory(commandParts[1]);
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
            case "exit":
                if(commandParts.length > 1) {
                    appendToTerminal("exit: too many arguments");
                }else{
                    exitDirectory();
                }
                break;
            case "open":
                if(commandParts.length < 2){
                    appendToTerminal("open: too few arguments");
                }else if (commandParts.length > 2){
                    appendToTerminal("open: too many arguments");
                }else{
                    openProgram(commandParts[1]);
                }
                
                break;
            default:
                // Check if the command is a file or program
                if(commandParts.length === 1){
                    const files: Array<{ name: string, mtime: number, size: number, is_dir: boolean }> = await invoke('list_directory_with_times', { path: directory });
                    const matchingFile = files.find(file => file.name === commandParts[0]);
                    if(matchingFile){
                        if(matchingFile.is_dir){
                            appendToTerminal(`'${commandParts[0]}' is not recognized as an internal or external command, operable program or file.`);
                        }else{
                            // Open the file

                        }
                    }else{
                        appendToTerminal(`'${commandParts[0]}' is not recognized as an internal or external command, operable program or file.`);
                    }
                }else{
                    appendToTerminal(`'${commandParts[0]}' is not recognized as an internal or external command, operable program or file.`);
                }
                break;
        }
    }

    return (
        <div className="relative text-white ml-[5vw] mt-[5vh] w-[50vw] text-sm bg-black/40 blur-none backdrop-blur-sm top-0 -z-100" ref={terminalRef}>
            <div className="absolute w-[45vw] h-[80vh] bg-black/40 blur-none backdrop-blur-sm top-0 -z-100"></div>
            <div className="relative blur-none z-20 p-[2vh] mr-[5vw] break-words outline-none select-none cursor-text h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                {/* DI JUD NI SYA MO WRAP ANG TEXT AMBOT NGANO*/}
                <div className="text-green-400 whitespace-pre overflow-wrap w-[40vw] break-words break-all" >{oldText}</div>

                <div className="flex items-center w-[40vw]">
                    <span className="pointer-events-none">{'honey_os' + honey_directory()}{'>'}</span>
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
