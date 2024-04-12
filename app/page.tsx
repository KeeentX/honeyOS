"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstTimeLogin, setFirstTimeLogin] = useState(true);
  
  const router = useRouter();

  const isInputFilled = (value: string) => {
    return value.trim() !== "";
  };

  useEffect(() => {
    if (isInputFilled(username) && isInputFilled(password)) {
        // setFirstTimeLogin(false);
    }
    
  }, [username, password, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-900 relative">
      <Image
        src="/loginbackground.jpg"
        alt="Login background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />

      <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg relative">
        <div className="relative inset-0 flex items-center justify-center p-2">
          <Image
            src="/usericon.png"
            alt="User Icon"
            width={70}
            height={70}
          />
        </div>

        {firstTimeLogin ? (
          <>
            <div className="mb-4 relative flex items-center">
              <input
                type="text"
                placeholder="Set Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-purple-500 rounded-md py-2 px-4 focus:outline-none focus:border-purple-600"
              />
              {!isInputFilled(username) && (
                <div className="absolute -right-6">
                  <Image
                    src="/bee.png"
                    alt="Bee"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
            <div className="mb-4 relative flex items-center">
              <input
                type="password"
                placeholder="Set Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-purple-500 rounded-md py-2 px-4 focus:outline-none focus:border-purple-600"
              />
              {!isInputFilled(password) && (
                <div className="absolute -right-6">
                  <Image
                    src="/bee.png"
                    alt="Bee"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mb-4 relative flex items-center">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-purple-500 rounded-md py-2 px-4 focus:outline-none focus:border-purple-600"
            />

            {!isInputFilled(password) && (
                <div className="absolute -right-6">
                  <Image
                    src="/bee.png"
                    alt="Bee"
                    width={40}
                    height={40}
                  />
                </div>
              )}
          </div>
        )}

        <Link href={isInputFilled(username) && isInputFilled(password) ? "/desktop" : "#"}>
          <div className="relative inset-0 flex items-center justify-center text-center cursor-pointer">
            <div className="text-center cursor-pointer relative">
              {isInputFilled(username) && isInputFilled(password) ? (
                <>
                  <Image
                    src="/bee.png"
                    alt="Bee"
                    width={40}
                    height={40}
                    className="absolute"
                  />
                  <Image
                    src="/flower.png"
                    alt="Flower Image"
                    width={50}
                    height={50}
                  />
                </>
              ) : (
                <Image
                  src="/flower.png"
                  alt="Flower Image"
                  width={50}
                  height={50}
                />
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
