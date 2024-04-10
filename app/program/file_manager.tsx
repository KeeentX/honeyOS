import WindowScreen from "@/app/desktop/components/window";
import React, {useEffect, useState} from "react";
import useFileSystem from "@/hooks/useFileSystem";
import {FileEntry} from "@tauri-apps/api/fs";
import {HoneyFile} from "@/app/types";
import NewFilePopup from "../desktop/components/file_manager_popup";
export default function FileManager({windowIndex, openedWindows, setOpenedWindows}: {
    windowIndex: number,
    openedWindows: React.JSX.Element[],
    setOpenedWindows: React.Dispatch<React.JSX.Element[]>

}) {
    const [currentDirList, setCurrentDirList] = useState<HoneyFile[]>();
    const {listDir, honey_directory, setDirectory, exitCurrentDir, makeDir} = useFileSystem();
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [popupType, setPopupType] = useState(""); // State to track the type of popup ("file" or "folder")
    const [popupPath, setPopupPath] = useState(""); // State to track the path for creating the file or folder
    useEffect(() => {
        listDir().then((files) => {
            setCurrentDirList(files);
        });
    }, [listDir()]);

    const handleAddFile = () => {
        setPopupType("file");
        setShowPopup(true);
    };
    
    const handleAddFolder = () => {
        setPopupType("folder");
        setShowPopup(true);
    };

    const handleSaveFolder = async (name) => {
        try {
          await makeDir(name);
          console.log("Folder created successfully");
          setShowPopup(false); // Close the popup after successful creation
        } catch (error) {
          console.log("Error creating folder:", error);
        }
      };
    
      const handleCancelFolder = () => {
        setShowPopup(false);
      };

    return (
        <WindowScreen name={'File Manager'} setOpenedWindows={setOpenedWindows} windowIndex={windowIndex}
                      openedWindows={openedWindows}>
            <div className="p-4 h-[60vh] w-[170vw] text-black">
                <div className="flex items-center space-x-2">
                    <button onClick={exitCurrentDir}>...</button>
                    <div className="overflow-x-auto whitespace-nowrap">{honey_directory()}</div>
                </div>
                
                {
                    currentDirList?.map((file, index) => {
                        return (
                            <div key={index}
                                 className="flex items-center justify-between border-b p-2 cursor-pointer"
                                    onClick={file.is_dir ? () => {
                                        const newDirectory = `${honey_directory()}\\${file.name}`;
                                        console.log('new directory', newDirectory);
                                        setDirectory(newDirectory);
                                
                                    }: () => {}}>
                                <div className="flex space-x-4">{file.is_dir ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                                    </svg> : (file.name.includes(".txt") ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                    </svg>
                                    )}
                                <span>{file.name}</span></div>
                            </div>
                        )
                    }   )
                }
                <div className={'p-2'}>
                    <button className={'p-2 border'}>Add File</button>
                    <button 
                    className={'p-2 border'}
                    onClick={handleAddFolder}
                    >Add Folder</button>
                </div>
                {showPopup && (
                    <NewFilePopup
                    onSave={handleSaveFolder}
                    onCancel={handleCancelFolder}
                    />
                )}
            </div>
        </WindowScreen>
    )
}