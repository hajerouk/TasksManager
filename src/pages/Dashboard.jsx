import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db, auth } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import Task from "../components/TaskItem";
import "../styles/App.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  // Charger les tâches depuis Firebase
  useEffect(() => {
    const tasksRef = ref(db, "tasks/");
    return onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      setTasks(data ? Object.values(data) : []);
    });
  }, []);

  // Ajouter une tâche
  const addTask = () => {
    if (!newTask.trim()) return;
    const tasksRef = ref(db, "tasks/");
    const newTaskRef = push(tasksRef);
    set(newTaskRef, {
      id: newTaskRef.key,
      text: newTask,
      date: date.toISOString().split("T")[0],
      done: false,
      createdBy: user.displayName,
      createdAt: new Date().toISOString(),
      lastModifiedBy: null,   // pas de modification au départ
      lastModifiedAt: null
    });
    setNewTask("");
    setShowForm(false);
  };

  // Filtrer les tâches
  const filteredTasks = tasks
    .filter(task => task.date === date.toISOString().split("T")[0])
    .filter(task => {
      if (filter === "all") return true;
      if (filter === "done") return task.done;
      if (filter === "todo") return !task.done;
    });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>📝 Mon Todo App</h1>
        <div className="user-info">
          <span>Bonjour, {user.displayName}</span>
          <button onClick={() => auth.signOut()}>Déconnexion</button>
        </div>
      </header>

      {/* Calendrier */}
      <div className="calendar-wrapper">
        <Calendar
          onChange={d => { setDate(d); setShowForm(true); }}
          value={date}
        />
      </div>

      {/* Filtre */}
      <div className="filter-wrapper">
        <label>Filtrer : </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Toutes</option>
          <option value="done">Faites</option>
          <option value="todo">À faire</option>
        </select>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="task-form">
          <input
            type="text"
            placeholder="Nouvelle tâche..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Ajouter</button>
          <button onClick={() => setShowForm(false)}>Annuler</button>
        </div>
      )}

      {/* Liste des tâches */}
      <div className="task-list">
        <h2>Tâches pour le {date.toLocaleDateString("fr-FR")}</h2>
        {filteredTasks.length === 0 ? (
          <p>Aucune tâche pour ce jour.</p>
        ) : (
          <ul>
            {filteredTasks.map(task => (
              <Task key={task.id} task={task} currentUser={user} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
