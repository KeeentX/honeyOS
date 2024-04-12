import React, {Dispatch} from "react";

export type FileProps = {
    name: string,
    mtime: number,
    size: number,
    is_dir: boolean
}

type appOpenedProps = {
    note: number,
    settings: number,
    camera: number,
    fileManager: number
}

export type WindowProps = {
    name?: string;
    children?: React.ReactNode;
    setOpenedWindows:  Dispatch<React.JSX.Element[]>;
    openedWindows: React.JSX.Element[];
    setAppOpenedState?:  Dispatch<appOpenedProps>;
    appOpenedState: appOpenedProps;
    windowIndex?: number;
}

export type HoneyFile = {
    name: string,
    mtime: string,
    size: string,
    is_dir: boolean
}
