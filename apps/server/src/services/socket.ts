import { Server } from "socket.io";
import Redis from "ioredis";
console.log("Initializing socket server");

const pub = new Redis(
    {
        host:"",
        port:0,
        username:"default",
        password:"",
        maxRetriesPerRequest: null, 
    }
);
const sub = new Redis(
    {
        host:"",
        port:0,
        username:"default",
        password:""
    }
);

const io = new Server(
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders:["*"]
        }
    }
);

const initListeners = () => {  
    console.log("Initializing socket listeners");
    sub.subscribe("MESSAGES")
    io.on("connect", (socket) => {
        console.log("Client connected", socket.id);
      
        socket.on("event:message", async (message: string) => {
          console.log("Received message", message);
          await pub.publish("MESSAGES", JSON.stringify({message}));
        });
      });

      sub.on('message', (channel, message) => {
        if(channel === "MESSAGES"){
            console.log("Sending message to all clients", message);
            io.emit("event:message", message);
        }
      })
 }



export { io, initListeners };
