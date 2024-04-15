"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useFont from "@/hooks/useFont";
import { SpeechRecognitionContext } from "./context/speechRecognitionContext";

export default function Home() {
  const { montserrat } = useFont();
  const [loginCommandEntered, setLoginCommandEntered] = useState(false);
  const {command} = useContext(SpeechRecognitionContext);
  
  const router = useRouter();

  const handleLoginClick = () => {
    setLoginCommandEntered(true);
  }

  useEffect(() => {
    // const commandWithoutComma = command.replace(",", "");
    console.log("command: ", command);
    if(command === "good day honey" || command === "good morning honey" || command === "good afternoon honey") {
      console.log('set to true');
      setLoginCommandEntered(true);
    }
  }, [command]);

  useEffect(() => {
    if (loginCommandEntered === true){
      setTimeout(() => {
        router.push("/desktop");
      }, 2000);
    }
  }, [loginCommandEntered]);

  return (
    <div className={`${montserrat.className} min-h-screen flex items-center justify-center bg-purple-900 relative`}>
      <Image
        src="/loginbackground.jpg"
        alt="Login background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />

      <div className="bg-white min-w-[360px] min-h-[300px] bg-opacity-70 p-8 rounded-lg shadow-lg relative items-center justify-center flex flex-col">
        <div className="relative inset-0 flex items-center justify-center p-2">
          <Image
            src="/usericon.png"
            alt="User Icon"
            width={70}
            height={70}
          />
        </div>

        <div className="text-black flex items-center justify-center">
        {!loginCommandEntered ? (
          <div className="text-center">
            <p className="mb-4">Say "Good day, honey" to login</p>
            <button className="text-black bg-slate-500 justify-center px-3 py-2 rounded-md hover:cursor-pointer hover:bg-slate-600" onClick={handleLoginClick}>Log in</button>
          </div>
        ) : (
          <div className="text-center text-[25px]">
            <p>Welcome, honey!</p>
            <div className="flex items-center justify-center">
              <Image src="/loading.gif" alt="Loading" width={100} height={100} />
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
