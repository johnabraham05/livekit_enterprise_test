"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";

import { Chat } from "@/components/chat";
import { Transcript } from "@/components/transcript";
import { useConnection } from "@/hooks/use-connection";
import { AgentProvider } from "@/hooks/use-agent";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export function RoomComponent() {
  const { shouldConnect, wsUrl, token } = useConnection();
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      audio={true}
      className="flex flex-col lg:flex-row flex-grow overflow-hidden border-l border-r border-b rounded-b-md"
      style={{ "--lk-bg": "white" } as React.CSSProperties}
      options={{
        publishDefaults: {
          stopMicTrackOnMute: true,
        },
      }}
    >
      <AgentProvider>
        <div className="flex flex-col w-full lg:w-2/3 p-4">
          <Transcript
            scrollContainerRef={transcriptContainerRef}
            scrollButtonRef={scrollButtonRef}
          />
          <div className="mt-4">
            <Chat />
          </div>
        </div>
        <RoomAudioRenderer />
        <StartAudio label="Click to allow audio playback" />
      </AgentProvider>
    </LiveKitRoom>
  );
}
