import React, {useState, useRef, useEffect, useContext} from "react";
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import useFileSystem from "@/hooks/useFileSystem";
import {OpenCamera, OpenFileManager, OpenNote, OpenSettings, SetFocus} from "@/app/desktop/programOpener";
import {OpenAppsContext} from "@/app/context/openedAppsContext";
import {OpenedWindowsContext} from "@/app/context/openedWindowsContext";
import {SpeechRecognitionContext} from "@/app/context/speechRecognitionContext";

export default function Terminal() {
    const {directory, setHoneyDirectory, honey_directory, exitCurrentDir, listDir, makeDir, createFile, readFile} = useFileSystem();
    // const [modifiedDirectory, setModifiedDirectory] = useState(directory.replace("C:\\honey\\root", "C:\\"));
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [oldText, setOldText] = useState("");
    const hasRunOnceRef = useRef(false);
    const {
        note,
        isNoteFocused,
        settings,
        isSettingsFocused,
        fileManager,
        isFileManagerFocused,
        camera,
        isCameraFocused,
        setAppOpenedState
    } = useContext(OpenAppsContext);
    const {openedWindows, setOpenedWindows} = useContext(OpenedWindowsContext);
    const {command, speak} = useContext(SpeechRecognitionContext);
    useEffect(() => {
        if (!hasRunOnceRef.current) {
            hasRunOnceRef.current = true;
            appendSystemInfoToTerminal();
        }

        if (terminalRef.current) {
            (terminalRef.current as HTMLElement).addEventListener("click", focusInput);
        }

        return () => {
            if (terminalRef.current) {
                (terminalRef.current as HTMLElement).removeEventListener("click", focusInput);
            }
        };
    }, []);

    useEffect(() => {
        if(!(isNoteFocused || isSettingsFocused || isCameraFocused || isFileManagerFocused) || command.includes("focus") || command.includes("open")) {
            command.length && appendToTerminal((honey_directory().length ? 'honey_os\\' : 'honey_os') + honey_directory()+'>'+command);
            if(!(command.includes("open") && isFileManagerFocused)) executeCommand(command).then(r => console.log(r));
        }
    }, [command]);

    useEffect(() => {
        // Get a reference to the terminal output div
        const terminalOutputDiv = document.getElementById('terminal');

        // Scroll the div to the bottom
        if (terminalOutputDiv) {
            terminalOutputDiv.scrollTo(0, terminalOutputDiv.scrollHeight);
        }
    }, [oldText]); // Run this effect whenever oldText changes

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
        console.log('Directory:', directory() + honey_directory());
        try {
            appendToTerminal(`\nDirectory of ${(honey_directory().length ? 'honeyos\\' : 'honeyos') + honey_directory()}\n`);
            const files2 = await listDir();
            files2.map(file => {
                appendToTerminal(`${file.mtime}\t\t${file.size}\t\t${file.name}`);
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
            console.log('new directory', directory() + newDirectory );
            await invoke('list_directory_with_times', { path: directory() + '\\' + newDirectory });
            setHoneyDirectory(dir);
            console.log(directory() + newDirectory)
        } catch (error) {
            appendToTerminal(`Error entering directory: ${error}`);
            console.log(error);
        }
    }

    /*
        CREATE [file/folder]
        - Creates a file or folder
     */

    async function createFileOrFolder(name: string) {
        try {
            if(name.includes('.')) await createFile(name);
            else await makeDir(name);
            await listCurrentDirectory();
        } catch (error) {
            console.log("Error creating file or folder:", error);
            appendToTerminal(`Error creating file or folder: ${error}`)
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
                OpenNote({
                    openedWindows,
                    setOpenedWindows,
                }, note, setAppOpenedState, {
                    name: "untitled.txt",
                    content: "",
                    location: directory() + '\\',
                });
                break;
            case "settings":
                OpenSettings({
                    openedWindows,
                    setOpenedWindows,
                }, settings, setAppOpenedState)
                break;
            case "camera":
                OpenCamera({
                    openedWindows,
                    setOpenedWindows,
                }, camera, setAppOpenedState);
                break;
            case "file_manager":
                OpenFileManager({
                    openedWindows,
                    setOpenedWindows,
                }, fileManager, setAppOpenedState);
                break;
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

            case "create":
                if(commandParts.length < 2) appendToTerminal("create: too few arguments");
                else if (commandParts.length > 2) appendToTerminal("create: too many arguments");
                else await createFileOrFolder(commandParts[1]);
                break;

            case "list":
                if(commandParts.length > 1){
                    appendToTerminal("list: too many arguments");
                }else{
                    console.log('Listing directory')
                    await listCurrentDirectory();
                }

                break;
            case "enter":
                if(commandParts.length < 2){
                    appendToTerminal("enter: too few arguments");
                }else if (commandParts.length > 2){
                    appendToTerminal("enter: too many arguments");
                }else{
                    await enterDirectory(commandParts[1]);
                }

                break;

            case "fetch":
                if(commandParts.length > 1) {
                    appendToTerminal("fetch: too many arguments");
                }else{
                    // appendToTerminal(asciiArt);
                    await appendSystemInfoToTerminal();
                }
                break;

            case "exit":
                if(commandParts.length > 1) {
                    appendToTerminal("exit: too many arguments");
                }else{
                    await exitDirectory();
                }
                break;

            case "open":
                if(commandParts.length < 2){
                    appendToTerminal("open: too few arguments");
                }else if (commandParts.length > 2){
                    appendToTerminal("open: too many arguments");
                }else{
                    await openProgram(commandParts[1]);
                }
                break;

            case "focus":
                if(commandParts.length < 2){
                    appendToTerminal("open: too few arguments");
                }else if (commandParts.length > 2){
                    appendToTerminal("open: too many arguments");
                } else{
                    SetFocus(commandParts[1], setAppOpenedState);
                }
                break;
            default:
                // Check if the command is a file or program
                if(commandParts.length === 1) {
                    const files: Array<{ name: string, mtime: number, size: number, is_dir: boolean }> = await invoke('list_directory_with_times', { path: directory() + '\\' + honey_directory()});
                    const matchingFile = files.find(file => file.name === commandParts[0]);
                    if(matchingFile){
                        if(matchingFile.is_dir){
                            appendToTerminal(`'${commandParts[0]}' is not recognized as an internal or external command, operable program or file.`);
                        }else{
                            OpenNote(
                                {openedWindows, setOpenedWindows},
                                0,
                                setAppOpenedState,
                                {
                                    content: (await readFile(matchingFile.name)).content,
                                    location: directory() + '\\' + honey_directory(),
                                    name: matchingFile.name,
                                }
                            )
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
        <div className="text-white ml-[5vw] mt-[5vh] w-[50vw] text-sm" ref={terminalRef}>
            <div
                id={"terminal"}
                className={`z-20 p-[2vh] mr-[5vw] break-words outline-none select-none cursor-text h-[80vh]
                overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-black/40 blur-none backdrop-blur-sm `}>

                {/* DI JUD NI SYA MO WRAP ANG TEXT AMBOT NGANO*/}
                <div className="text-green-400 whitespace-pre overflow-wrap w-[40vw] break-words break-all" >{oldText}</div>

                <div className="flex items-center w-[40vw]">
                    <span className="pointer-events-none">{(honey_directory().length ? 'honey_os\\' : 'honey_os') + honey_directory()}{'>'}</span>
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