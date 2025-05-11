// src/App.jsx
import { useEffect, useState } from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import QueueList from "./pages/QueueList";
import JoinForm from "./pages/JoinForm";

function App() {
  const [user, setUser] = useState(null); // app user info
  const [authUser, setAuthUser] = useState(null); // firebase auth user

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAuthUser(firebaseUser);
      } else {
        signInAnonymously(auth);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-center pt-10">
      <h1 className="text-2xl font-bold mb-4">🔌 ChargeQueue</h1>

      {!authUser ? (
        <p>Connecting...</p>
      ) : !user ? (
        <JoinForm onJoin={setUser} uid={authUser.uid} />
      ) : (
        <>
          <p className="text-lg mb-4">Welcome, {user.name}!</p>
          <QueueList currentUser={user} />
        </>
      )}
    </div>
  );
}

export default App;
