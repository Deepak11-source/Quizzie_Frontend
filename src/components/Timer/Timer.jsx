import { useEffect, useState } from "react";

const Timer = ({ timer }) => {
  const [seconds, setSeconds] = useState(timer);

  useEffect(() => {
    let timerInterval;

    if (seconds > 0) {
      timerInterval = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            clearInterval(timerInterval);
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval); 
  }, [seconds, timer]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return <>{formatTime(seconds)}</>;
};

export default Timer;
