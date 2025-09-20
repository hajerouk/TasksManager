// src/components/TaskList.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, push, remove, update } from "firebase/database";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedTasks = Object.keys(data).map((id) => ({ id, ...data[id] }));
      setTasks(loadedTasks);
    });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    push(ref(db, "tasks"), {
      text: newTask,
      done: false,
      createdBy: user.displayName || user.email,
    });
    setNewTask("");
  };

  const toggleDone = (task) => {
    update(ref(db, `tasks/${task.id}`), { done: !task.done });
  };

  const deleteTask = (task) => {
    remove(ref(db, `tasks/${task.id}`));
  };

  return (
    <div className="dashboard-container">
      <div className="task-form">
        <input
          type="text"
          placeholder="Nouvelle tâche..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Ajouter</button>
      </div>
      <div className="task-list">
        <h2>Mes tâches</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.done ? "done" : ""}`}>
              <span onClick={() => toggleDone(task)}>{task.text}</span>
              <small>— ajouté par {task.createdBy}</small>
              <div className="task-actions">
                <span className="check-icon" onClick={() => toggleDone(task)}>
                  {task.done ? "✅" : "☑️"}
                </span>
                <span className="delete-icon" onClick={() => deleteTask(task)}>❌</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
