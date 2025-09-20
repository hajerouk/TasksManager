// src/App.js
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Auth from "./contexts/AuthContext";
import TaskList from "./components/TaskList";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="App">
      {!user ? (
        <Auth />
      ) : (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h2>Bienvenue {user.displayName || user.email}</h2>
            <div className="user-info">
              <button onClick={handleLogout}>Se déconnecter</button>
            </div>
          </header>
          <TaskList user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
