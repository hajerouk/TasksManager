import React, { useState } from "react";
import { ref, update, remove } from "firebase/database";
import { db, auth } from "../firebase/firebase";
import { FaCheckCircle, FaEdit, FaTrash, FaSave } from "react-icons/fa";

export default function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  // Nom de l'utilisateur courant (string simple)
  const currentUser = auth.currentUser?.displayName || auth.currentUser?.email || "Anonyme";

  const handleToggle = async () => {
    const taskRef = ref(db, "tasks/" + task.id);
    await update(taskRef, { done: !task.done });
  };

  const handleSave = async () => {
    if (newText.trim() === "") return;

    const taskRef = ref(db, "tasks/" + task.id);
    await update(taskRef, {
      text: newText,
      modifiedBy: currentUser, // ← PAS d'objet, uniquement string
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const taskRef = ref(db, "tasks/" + task.id);
    await remove(taskRef);
  };

  return (
    <div className="task-item">
      {!isEditing && task.modifiedBy && (
        <div className="modified-by">Modifié par    {   task.modifiedBy}</div>
      )}

      {isEditing ? (
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="edit-textarea"
        />
      ) : (
        <span className={task.done ? "task-done" : ""}>{task.text}</span>
      )}

      <div className="task-actions">
        <FaCheckCircle
          onClick={handleToggle}
          className={`check-icon ${task.done ? "done" : ""}`}
        />
        {isEditing ? (
          <FaSave onClick={handleSave} className="save-icon" title="Sauvegarder" />
        ) : (
          <FaEdit onClick={() => setIsEditing(true)} className="edit-icon" />
        )}
        <FaTrash onClick={handleDelete} className="delete-icon" />
      </div>
    </div>
  );
}
