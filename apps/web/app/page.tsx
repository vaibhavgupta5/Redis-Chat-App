"use client";
import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";

function Page() {
  const { sendMessage, messages } = useSocket();

  const [message, setMessage] = useState("");

  console.log(messages);

  return (
    <div>
      <h1>Page</h1>
      <div>
        <h2>All Messages Here</h2>
        <ul>
          {messages?.map((msg, i) => (
            <li key={i}>{typeof msg === "object" ? msg.message : msg}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type here"
          type="text"
        />
        <button
          onClick={(e) => {
            sendMessage(message);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Page;
