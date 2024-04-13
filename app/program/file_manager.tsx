import WindowScreen from "@/app/desktop/components/window";
import React, {useEffect, useState} from "react";
import useFileSystem from "@/hooks/useFileSystem";
import NewFilePopup from "../desktop/components/file_manager_popup";
import {appOpenedProps, HoneyFile} from "@/app/types";
import { DocumentTextIcon, EllipsisVerticalIcon, FolderIcon, PhotoIcon, TrashIcon } from "@heroicons/react/16/solid";
export default function FileManager({windowIndex, openedWindows, setOpenedWindows, appOpenedState}: {
    windowIndex: number,
    openedWindows: React.JSX.Element[],
    setOpenedWindows: React.Dispatch<React.JSX.Element[]>
    appOpenedState: appOpenedProps
}) {
    const [currentDirList, setCurrentDirList] = useState<HoneyFile[]>();

    const {listDir, honey_directory, setHoneyDirectory, exitCurrentDir, makeDir, deleteDir, deleteFile} = useFileSystem();
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [popupType, setPopupType] = useState(""); // State to track the type of popup ("file" or "folder")
    const [popupPath, setPopupPath] = useState(""); // State to track the path for creating the file or folder
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false); // State to control options dropdown visibility
    const [showOptionsDropdownForFile, setShowOptionsDropdownForFile] = useState<number | null>(null); // State to track which file's options dropdown is open

    const handleOptionsButtonClick = (index: number) => {
        setShowOptionsDropdownForFile(index === showOptionsDropdownForFile ? null : index); // Toggle the dropdown for the clicked file
    };


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

    const handleSaveFolder = async (name: string) => {
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

      const handleDelete = async (fileName: string, isDir: boolean) => {
        try{
            if (isDir) {
                // Delete directory
                await deleteDir(fileName);
            } else {
                // Delete file
                await deleteFile(fileName);
            }
            console.log(`${isDir ? 'Directory' : 'File'} "${fileName}" deleted succesfully`);
            // Refresh the directory listing after the deletion
            listDir().then((files) => {
                setCurrentDirList(files);
            });
        } catch (error) {
            console.log(`Error deleting ${isDir ? 'directory' : 'file'} "${fileName}":`, error);
        }
      }

    return (
        <WindowScreen name={'File Manager'} setOpenedWindows={setOpenedWindows} windowIndex={windowIndex}
                      openedWindows={openedWindows} appOpenedState={appOpenedState}>
            <div className="p-4 h-[60vh] w-[170vw] text-black">
                <div className="flex items-center space-x-2">
                    <button onClick={exitCurrentDir}>...</button>
                    <div className="overflow-x-auto whitespace-nowrap">{honey_directory()}</div>
                </div>
                
                {
                    currentDirList?.map((file, index) => {
                        return (
                            <div key={index}
                                 className="flex items-center justify-between p-1 cursor-pointer w-[47vw] max-w-[170vw]"
                                    onClick={file.is_dir ? () => {
                                        setHoneyDirectory(file.name);
                                
                                    }: () => {}}>
                                <div className="flex items-center space-x-4 flex-grow">
                                    {file.is_dir ? (
                                        <FolderIcon className="w-6 h-6" />
                                    ) : file.name.includes(".txt") ? (
                                        <DocumentTextIcon className="w-6 h-6" />
                                    ) : (
                                        <PhotoIcon className="w-6 h-6" />
                                    )}
                                    <span>{file.name}</span>
                                </div>
                                <div className="relative">
                                    <button className="w-6 h-6 border-none focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Show or hide options dropdown
                                        handleOptionsButtonClick(index);
                                    }}>
                                        <EllipsisVerticalIcon className="w-6 h-6" />
                                    </button>
                                    {/* Delete option */}
                                    {showOptionsDropdownForFile === index && (
                                        <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-lg z-10">
                                            {/* Delete option */}
                                            <button className="flex border w-full px-4 py-2 space-x-2 items-center hover:bg-gray-200 focus:outline-none" onClick={(e) => {
                                                e.stopPropagation();
                                                // Pass the file name and type (file or directory) to the delete function 
                                                handleDelete(file.name, file.is_dir);
                                            }}>
                                                <TrashIcon className="w-4 h-4" /> <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
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