import { RoomComponent } from "@/components/room-component";


export default function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <header className="flex flex-shrink-0 h-12 items-center justify-between px-4 w-full md:mx-auto">
      </header>
      <main className="flex flex-col flex-grow overflow-hidden p-0 md:p-2 md:pt-0 w-full md:mx-auto">
        <RoomComponent />
      </main>
    </div>
  );
}
