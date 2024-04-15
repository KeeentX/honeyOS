'use client'

import React, {createContext, useState} from "react";

export const OpenedWindowsContext = createContext<{openedWindows: React.JSX.Element[], setOpenedWindows: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>}>({
    openedWindows: [],
    setOpenedWindows: () => {}
})
export default function OpenedWindowsProvider({children}: {children: React.ReactNode}) {
    const [openedWindows, setOpenedWindows] = useState<React.JSX.Element[]>([]);
    return <OpenedWindowsContext.Provider value={{openedWindows, setOpenedWindows}}>{children}</OpenedWindowsContext.Provider>
}