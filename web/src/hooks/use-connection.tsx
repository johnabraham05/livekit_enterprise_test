"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { v4 as uuidv4 } from 'uuid';

export type ConnectFn = () => Promise<void>;

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  disconnect: () => Promise<void>;
  connect: ConnectFn;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(
  undefined,
);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    shouldConnect: boolean;
  }>({ wsUrl: "", token: "", shouldConnect: false });


  const connect = async () => {
    console.log("🔍 Initiating connection process...");
    
    try {
      console.log("🔄 Joining room...");
      const joinRoomResponse = await fetch('https://us-central1-creators-a-g-i-2-7qvbri.cloudfunctions.net/api/v3/socket/join', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          'roomName': `testRoom-${uuidv4()}`,
          'userId': "testUser",
          'assistantId': "QPuDDDy56n5QmEwjYvsh-Clone-hOaujN",
          'skipWelcomeMessage': true,
        }),
      });

      console.log("📡 Join room response status:", joinRoomResponse.status);

      if (!joinRoomResponse.ok || joinRoomResponse.status !== 200) {
        console.error("❌ Failed to create/join room. Response not OK.");
        throw new Error('Failed to create/join room');
      }

      const roomData = await joinRoomResponse.json();
      console.log("📝 Room data received:", roomData);

      if (!roomData.success) {
        console.error("❌ Room join unsuccessful:", roomData.error);
        throw new Error(roomData.error || "Failed to join room");
      }

      setConnectionDetails({
        wsUrl: "wss://creatorsagi-test-app-tnlpsdmb.livekit.cloud",
        token: roomData.data.token,
        shouldConnect: true,
      });

      console.log("✅ Connection details set, attempting WebSocket connection");
      console.log("📣 'shouldConnect' changed to **true** in connect function");
    } catch (error) {
      console.error("❌ Connection error:", error);
      throw error;
    }
  };

  const disconnect = useCallback(async () => {
    console.log("🔌 Disconnecting from the room...");
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
    console.log("✅ Successfully disconnected from the room.");
    console.log("📣 'shouldConnect' changed to **false** in disconnect function");
  }, []);


  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);

  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }

  return context;
};
