import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const generateSlots = () => {
  const slots = [];
  let hour = 9, minute = 0;
  while (hour < 18) {
    const time = `${hour.toString().padStart(2, "0")}:${minute === 0 ? "00" : minute}`;
    slots.push(time);
    minute += 30;
    if (minute === 60) { minute = 0; hour++; }
  }
  return slots;
};

const SlotManager = ({ uid, name, setName, setHasBooking }) => {
  const [slots, setSlots] = useState({});
  const [bookedSlot, setBookedSlot] = useState(null);
  const [isNameSaved, setIsNameSaved] = useState(false);
  const slotTimes = generateSlots();
  const todayId = new Date().toISOString().split("T")[0];
  const ref = doc(db, "slots", todayId);

  useEffect(() => {
    const savedBooking = localStorage.getItem("bookedSlot");
    if (savedBooking) {
      setBookedSlot(savedBooking);
      setIsNameSaved(true);
    }

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? snap.data() : {};
      setSlots(data);
      const found = Object.entries(data).find(([_, val]) => val.uid === uid);
      setBookedSlot(found ? found[0] : savedBooking);
      setHasBooking(!!found);
    });

    return () => unsub();
  }, [uid]);

  const bookSlot = async (slot) => {
    if (!uid || !name.trim() || bookedSlot || slots[slot]) return;
    await setDoc(ref, { ...slots, [slot]: { uid, name } });
    setBookedSlot(slot);
    localStorage.setItem("bookedSlot", slot);
    setIsNameSaved(true);
  };

  const unbookSlot = async () => {
    const updated = { ...slots };
    delete updated[bookedSlot];
    await setDoc(ref, updated);
    setBookedSlot(null);
    localStorage.removeItem("bookedSlot");
    setIsNameSaved(false);
  };

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setName(savedName);
      setIsNameSaved(true);
    }
  }, []);

  return (
    <div className="space-y-4">
      {!bookedSlot && !isNameSaved && (
        <div className="space-y-2">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full transition-all duration-300"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2 mt-6">
        {slotTimes.map((time) => {
          const entry = slots[time];
          const isYou = entry?.uid === uid;
          const isBooked = !!entry;
          
          return (
            <div
              key={time}
              className={`flex justify-between items-center p-3 rounded border transition-all duration-300 ease-in-out
                ${isYou ? "bg-blue-100 border-blue-500" :
                 isBooked ? "bg-red-100 border-red-400" :
                 "bg-green-100 border-green-400"
                }`}
            >
              <div className="flex items-center w-full">
                <span className="font-semibold">{time}</span>
                {isYou && <span className="ml-2 text-blue-600">(You)</span>}
                {isBooked && !isYou && (
                  <span className="ml-2 text-red-600">({entry.name})</span>
                )}
                {isYou && (
                  <button
                    onClick={unbookSlot}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-all duration-300 ml-auto"
                  >
                    Unbook
                  </button>
                )}
              </div>

              {uid && name && (
                <>
                  {!isBooked && !bookedSlot && (
                    <button
                      onClick={() => bookSlot(time)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-all duration-300"
                    >
                      Book
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlotManager;
