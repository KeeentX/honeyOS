import WindowScreen from "@/app/desktop/components/window";
import React, {useEffect, useState} from "react";
import useFileSystem from "@/hooks/useFileSystem";
import {FileEntry} from "@tauri-apps/api/fs";
import {appOpenedProps, HoneyFile} from "@/app/types";
import {app} from "@tauri-apps/api";
export default function FileManager({windowIndex, openedWindows, setOpenedWindows, appOpenedState}: {
    windowIndex: number,
    openedWindows: React.JSX.Element[],
    setOpenedWindows: React.Dispatch<React.JSX.Element[]>
    appOpenedState: appOpenedProps
}) {
    const [currentDirList, setCurrentDirList] = useState<HoneyFile[]>();
    const {listDir, honey_directory, setHoneyDirectory, exitCurrentDir, makeDir} = useFileSystem();
    useEffect(() => {
        listDir().then((files) => {
            setCurrentDirList(files);
        });
    }, [listDir()]);
    return (
        <WindowScreen name={'File Manager'} setOpenedWindows={setOpenedWindows} windowIndex={windowIndex}
                      openedWindows={openedWindows} appOpenedState={appOpenedState}>
            <div className="p-4 h-[60vh] w-[170vw] text-black">
                <button onClick={exitCurrentDir}>...</button>
                {
                    currentDirList?.map((file, index) => {
                        return (
                            <div key={index}
                                 className="flex items-center justify-between border-b p-2 cursor-pointer"
                                    onClick={file.is_dir ? () => {
                                        setHoneyDirectory(file.name);
                                
                                    }: () => {}}>
                                <div>{file.name}</div>
                            </div>
                        )
                    }   )
                }
                <div className={'p-2'}>
                    <button className={'p-2 border'}>Add File</button>
                    <button 
                    className={'p-2 border'}
                    onClick={async () => {
                        try {
                            await makeDir("new_folder")
                            console.log("hello");
                        } catch(e) {
                            console.log('i am error', e)
                        }
                    }}
                    >Add Folder</button>
                </div>
            </div>
        </WindowScreen>
    )
}