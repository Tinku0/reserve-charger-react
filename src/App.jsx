// src/App.jsx
import { useEffect, useState } from "react";
import SlotManager from "./pages/SlotManager";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const App = () => {
  const [uid, setUid] = useState(null);
  const [name, setName] = useState("");
  const [hasBooking, setHasBooking] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) setUid(user.uid);
    });
    signInAnonymously(auth);
    return () => unsub();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔌 Charging Slot Booking</h1>
      <SlotManager uid={uid} name={name} setName={setName} setHasBooking={setHasBooking} hasBooking={hasBooking} />
    </div>
  );

};

export default App;
