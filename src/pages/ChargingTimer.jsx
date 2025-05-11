// src/components/ChargingTimer.jsx
import { useEffect, useState } from "react";

const ChargingTimer = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          onComplete(); // auto-leave
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)
      .toString()
      .padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  return (
    <div className="mt-4">
      <p className="text-lg font-semibold">⏱ Charging Timer</p>
      <p className="text-2xl">{formatTime(timeLeft)}</p>
      <button
        onClick={onComplete}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
      >
        Done Charging
      </button>
    </div>
  );
};

export default ChargingTimer;
