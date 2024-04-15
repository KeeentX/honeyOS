import React, {Dispatch} from "react";

export type FileProps = {
    name: string,
    mtime: number,
    size: number,
    is_dir: boolean
}

export type OpenedWindowsProps = {
    openedWindows: React.JSX.Element[],
    setOpenedWindows: Dispatch<React.JSX.Element[]>

}
export type WindowProps = {
    name?: string,
    customName?: string,
    children?: React.ReactNode,
    icon?: React.JSX.Element,
    windowIndex?: number,
    file?: {
        content: string,
        location: string
        name: string,
    }
}

export type HoneyFile = {
    name: string,
    mtime: string,
    size: string,
    is_dir: boolean
}
