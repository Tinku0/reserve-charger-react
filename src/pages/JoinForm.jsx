import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const JoinForm = ({ onJoin, uid }) => {
  const [name, setName] = useState("");
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 NEW

  useEffect(() => {
    const checkAlreadyJoined = async () => {
      const q = query(collection(db, "queue"), where("uid", "==", uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        onJoin({ id: doc.id, ...doc.data() });
        setAlreadyJoined(true);
      }
      setLoading(false); // 👈 stop loading after check
    };
    checkAlreadyJoined();
  }, [uid, onJoin]);

  const handleJoin = async () => {
    const docRef = await addDoc(collection(db, "queue"), {
      name,
      uid,
      joinedAt: serverTimestamp(),
    });
    onJoin({ id: docRef.id, name, uid });
  };

  // 🔒 1. Show loading message
  if (loading) return <p>Checking queue status...</p>;

  // ✅ 2. If already in queue
  if (alreadyJoined) return <p>You're already in the queue!</p>;

  // 📝 3. Show input once ready
  return (
    <div className="p-4">
      <input
        className="border px-2 py-1 mr-2"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white px-4 py-1"
        disabled={!name}
      >
        Join Queue
      </button>
    </div>
  );
};

export default JoinForm;