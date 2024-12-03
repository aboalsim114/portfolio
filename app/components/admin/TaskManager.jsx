"use client";

import { useState } from 'react';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="bg-[#1a1443] p-6 rounded-xl mt-6">
      <h3 className="text-xl font-bold mb-4">Gestionnaire de Tâches</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Nouvelle tâche..."
          className="flex-1 p-2 rounded-lg bg-[#0d1224] border border-gray-700"
        />
        <button
          onClick={addTask}
          className="p-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-lg hover:opacity-90"
        >
          <FaPlus />
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-[#0d1224] rounded-lg"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleTask(task.id)}
                className={`p-1 rounded-full ${
                  task.completed ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <FaCheck size={12} />
              </button>
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-600"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 