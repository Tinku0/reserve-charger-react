import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import ChargingTimer from "./ChargingTimer";

const QueueList = ({ currentUser }) => {
  const q = query(collection(db, "queue"), orderBy("joinedAt"));
  const [queueSnapshot, loading, error] = useCollection(q);

  if (loading) return <p>Loading queue...</p>;
  if (error) return <p>Error loading queue</p>;

  const queue = queueSnapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const handleLeave = async () => {
    await deleteDoc(doc(db, "queue", currentUser.id));
    window.location.reload(); // or lift state up to App.jsx
  };

  return (
    <div className="mx-auto max-w-md bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-2">📋 Current Queue</h2>
      <ul className="text-left space-y-2 mb-4">
        {queue.map((user, index) => (
          <li
            key={user.id}
            className={`p-2 rounded ${
              user.id === currentUser.id
                ? "bg-green-100 font-bold"
                : index === 0
                ? "bg-yellow-100"
                : "bg-gray-100"
            }`}
          >
            {index === 0 ? "⚡ Charging now: " : ""}
            {user.name}
          </li>
        ))}
      </ul>

      {currentUser && (
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Leave Queue
        </button>
      )}

      <ChargingTimer onComplete={handleLeave} />
    </div>
  );
};

export default QueueList;
