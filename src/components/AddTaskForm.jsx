import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { db } from "../firebase/firebase";

export default function AddTaskForm({ selectedDate }) {
  const [text, setText] = useState("");

  const add = async (e) => {
    e && e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const tasksRef = ref(db, "tasks/");
    const newRef = push(tasksRef);
    const iso = selectedDate.toISOString().split("T")[0];
    await set(newRef, {
      id: newRef.key,
      text: value,
      dueDate: iso,
      done: false,
      createdAt: Date.now()
    });
    setText("");
  };

  return (
    <form className="addtask-form" onSubmit={add}>
      <input placeholder="Nouvelle tâche..." value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Ajouter</button>
    </form>
  );
}
