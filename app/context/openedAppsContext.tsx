"use client"

import React, {createContext, useState} from "react";

export type AppOpenedProps = {
    note: number,
    isNoteFocused: boolean,
    settings: number,
    isSettingsFocused: boolean,
    camera: number,
    isCameraFocused: boolean,
    fileManager: number
    isFileManagerFocused: boolean
}

type AuthState = AppOpenedProps & {
    setAppOpenedState: React.Dispatch<React.SetStateAction<AppOpenedProps>>
}

export const OpenAppsContext = createContext<AuthState>({
    note: 0,
    isNoteFocused: false,
    settings: 0,
    isSettingsFocused: false,
    camera: 0,
    isCameraFocused: false,
    fileManager: 0,
    isFileManagerFocused: false,
    setAppOpenedState: () => {}
})
export default function OpenedAppsProvider({children}: {children: React.ReactNode}) {
    const [appOpenedState, setAppOpenedState] = useState<AppOpenedProps>({
        note: 0,
        isNoteFocused: false,
        settings: 0,
        isSettingsFocused: false,
        camera: 0,
        isCameraFocused: false,
        fileManager: 0,
        isFileManagerFocused: false
    })

    return <OpenAppsContext.Provider value={{...appOpenedState, setAppOpenedState}}>{children}</OpenAppsContext.Provider>
}