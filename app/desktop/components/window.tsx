import React, {useContext, useEffect, useRef, useState} from 'react';
import {WindowProps} from "@/app/types";
import {OpenAppsContext} from "@/app/context/openedAppsContext";
import {OpenCamera, OpenFileManager, OpenNote, OpenSettings, SetFocus} from "@/app/desktop/programOpener";
import {FaMaximize, FaMinimize, FaX, FaXmark} from "react-icons/fa6";
import {FaCross, FaRegWindowClose, FaWindowClose, FaXbox} from "react-icons/fa";
import useFont from "@/hooks/useFont";
import {OpenedWindowsContext} from "@/app/context/openedWindowsContext";

export default function WindowScreen({ name, children, icon, windowIndex, customName}: WindowProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 4, y: window.innerHeight / 4});
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const {openedWindows, setOpenedWindows} = useContext(OpenedWindowsContext);
  const {
    setAppOpenedState,
    isNoteFocused,
    note,
    isSettingsFocused,
    settings,
    isCameraFocused,
    camera,
    isFileManagerFocused,
    fileManager,
  } = useContext(OpenAppsContext);
  const {montserrat} = useFont();
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [/* onClose */]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };
  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const closeThisWindow = () => {
    name == "Note" && setAppOpenedState(prevState => {
      return {...prevState, note: 0, isNoteFocused: false}
    });
    name == "Settings" && setAppOpenedState(prevState => {
      return {...prevState, settings: 0, isSettingsFocused: false}
    });
    name == "File Manager" && setAppOpenedState(prevState => {
      return {...prevState, fileManager: 0, isFileManagerFocused: false}
    });
     name == "Camera" && setAppOpenedState(prevState => {
      return {...prevState, camera: 0, isCameraFocused: false}
    });
    windowIndex && setOpenedWindows(openedWindows.filter((_, index) => index !== windowIndex - 1));
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`${isMaximized ? 'w-full h-[100vh]' : 'w-auto h-auto'} rounded-xl
      ${(
        isNoteFocused && name == "Note" || 
        isCameraFocused && name == "Camera" || 
        isSettingsFocused && name == "Settings" || 
        isFileManagerFocused && name == "File Manager") ? 
          'z-50 border-2 border-yellow-500 shadow-lg bg-primary' : 'z-10 opacity-80 bg-primary/40 blur-none backdrop-blur-sm '
      }` }
      style={{
        position: 'absolute',
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 0: `${position.y}px`,
        pointerEvents: 'auto',
        transition: 'opacity 0.2s, height 0.2s',
      }}
      onClick={() => {
        name && SetFocus(name, setAppOpenedState);
      }}
    >
    <div
      className={`${isMaximized ? 'w-full h-full' : 'w-[50vw] h-[50vh]'} bg-white text-black p-0 m-0 border-primary 
      relative rounded-lg`}
    >
      <div className="relative w-full h-full">
        {children}
      </div>
      <div className={`flex justify-between items-center text-white modal-action bg-primary absolute bottom-0 w-full 
      h-[5vh] select-none rounded-b-lg`}
           onMouseDown={handleMouseDown}>
        <span className="pl-[1vw] flex flex-row space-x-3">
          {icon} {<p className={`text-md ${montserrat.className}`}>{customName ? customName : name}</p>}
        </span>
        <div className="flex space-x-2 items-center pr-[1vw] text-black">
          <button className="w-[3vh] h-[3vh] rounded-full bg-green-700 text-center p-2 text-gray-900" onClick={() => {
            name == "Note" && OpenNote({openedWindows, setOpenedWindows}, note, setAppOpenedState);
            name == "Settings" && OpenSettings({openedWindows, setOpenedWindows}, settings, setAppOpenedState);
            name == "Camera" && OpenCamera({openedWindows, setOpenedWindows}, camera, setAppOpenedState);
            name == "File Manager" && OpenFileManager({openedWindows, setOpenedWindows}, fileManager, setAppOpenedState);
          }}>
            <FaMinimize />
          </button>
          <button className="w-[3vh] h-[3vh] rounded-full bg-yellow-300 text-center p-2 text-gray-900" onClick={() => {setIsMaximized(prevState => !prevState)}}>
            <FaMaximize/>
          </button>
          <button className="w-[3vh] h-[3vh] rounded-full bg-red-800 text-center p-2 text-gray-900" onClick={closeThisWindow}>
            <FaXbox/>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
