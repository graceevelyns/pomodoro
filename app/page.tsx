'use client';

import Timer from './components/Timer';
import ToDoList from './components/ToDoList';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/img/bg1.png"
          alt="Study Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Draggable Components */}
      <Timer />
      <ToDoList />
    </main>
  );
}