// Example: src/pages/TestSocket.tsx
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";

const TestSocket = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    // Connect to your Socket.IO server
    const socket: Socket = io("ws://localhost:3007", {
      query: { userId: user.id }
    });

    socket.on("connect", () => {
      console.log("✅ Connected to ws server!");
    });

    socket.on("order-update", (data) => {
      console.log("📦 Order update received:", data);
      alert("Order update: " + JSON.stringify(data));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return <div>Socket.IO test running (check console for logs)</div>;
};

export default TestSocket; 