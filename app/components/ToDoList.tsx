'use client';

import { useState } from 'react';

export default function ToDoList() {
  const [position, setPosition] = useState({ x: 900, y: 350 });
  const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>([]);
  const [input, setInput] = useState('');

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = position;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setPosition({ x: x + dx, y: y + dy });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const addTask = () => {
    if (input.trim() !== '') {
      setTasks([...tasks, { text: input.trim(), done: false }]);
      setInput('');
    }
  };

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: 'grab',
      }}
      className="bg-zinc-900 text-white rounded-xl p-4 shadow-xl w-full max-w-sm select-none"
    >
      <h2 className="text-lg font-semibold mb-4">Things to do</h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-1 px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a task..."
        />
        <button
          onClick={addTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-zinc-800 px-3 py-2 rounded-md"
          >
            <label className="flex items-center gap-2 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(index)}
                className="form-checkbox h-5 w-5 accent-white border border-white"
              />
              <span
                className={`flex-1 ${task.done ? 'line-through text-zinc-400' : ''}`}
              >
                {task.text}
              </span>
            </label>
            <button
              onClick={() => removeTask(index)}
              className="text-red-500 hover:text-red-700 ml-2 text-sm"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}