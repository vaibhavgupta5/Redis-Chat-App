"use client";
import React, { useCallback, useEffect, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface SocketProviderProps {
  children: React.ReactNode;
}

export interface ISocketContext {
  sendMessage: (message: string) => any;
  messages?: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () =>{
   const state = useContext(SocketContext);

    if (!state) {
      throw new Error("SocketProvider not found");
    }

    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([]);
    const onMessageReceived = useCallback((msg: string) => {
        console.log("Received server message", msg);  
        const { message } = JSON.parse(msg) as { message: string };
        setMessages((prev) => [...prev, message]);
        console.log(messages);
    }, []);

   

    useEffect(() => {
        const socket = io("http://localhost:8000");
        setSocket(socket);
        socket.on("event:message", onMessageReceived);
        console.log("Server connected", socket);
        return () => {
            socket.disconnect();
            socket.off("event:message", onMessageReceived);
            console.log("Server disconnected", socket.id);
            setSocket(undefined);
        }

    }, []);

  const sendMessage: ISocketContext["sendMessage"] = useCallback((message) => {
    if(socket){
        socket.emit("event:message", {message})
    }
    console.log("Sending message", message);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
