import React, {Dispatch, useEffect, useRef, useState} from 'react';
import {WindowProps} from "@/app/types";

export default function WindowScreen({ name, children, setOpenedWindows, openedWindows, windowIndex, appOpenedState, setAppOpenedState}: WindowProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 4, y: window.innerHeight / 4});
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

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
    setAppOpenedState && name == "note" && setAppOpenedState({...appOpenedState, note: 0});
    setAppOpenedState && name == "settings" && setAppOpenedState({...appOpenedState, settings: 0});
    setAppOpenedState && name == "file manager" && setAppOpenedState({...appOpenedState, fileManager: 0});
    setAppOpenedState && name == "camera" && setAppOpenedState({...appOpenedState, camera: 0});
    setOpenedWindows(openedWindows.filter((_, index) => index !== windowIndex));
  }

  useEffect(() => {
    console.log('is minimized', isMinimized)
  }, [isMinimized]);

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
      className={`${isMaximized ? 'w-full h-full' : 'w-auto h-auto'} `}
      id={`window-${windowIndex}`}
      style={{
        position: 'absolute',
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 0: `${position.y}px`,
        display: isMinimized ? 'none' : 'block',
        pointerEvents: 'auto',
        transition: 'opacity 0.2s, height 0.2s',
      }}
    >
    <div
      className={`${isMaximized ? 'w-full h-full' : 'w-[50vw] h-[50vh]'} bg-white text-black p-0 m-0 border-primary border-2 relative`}
    >
      <div className="relative w-full h-full">
        {children}
      </div>
      <div className="flex justify-between items-center text-white modal-action bg-primary absolute bottom-0 w-full h-[5vh] select-none" onMouseDown={handleMouseDown}>
        <span className="pl-[1vw]">{name}</span>
        <div className="flex space-x-2 items-center pr-[1vw] text-black">
          <button className="w-[3vh] h-[3vh] rounded-full bg-green-700" onClick={() => {setIsMinimized(true)}}>
            -
          </button>
          <button className="w-[3vh] h-[3vh] rounded-full bg-yellow-300" onClick={() => {setIsMaximized(prevState => !prevState)}}>
            o
          </button>
          <button className="w-[3vh] h-[3vh] rounded-full bg-red-700" onClick={closeThisWindow}>
            x
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
