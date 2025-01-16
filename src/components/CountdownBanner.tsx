import { useEffect, useState } from "react";

const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2025-02-15T00:00:00");
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Set up interval and store its ID
    const timerId = setInterval(calculateTimeLeft, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-primary text-primary-foreground py-2 px-4 z-50 text-center text-sm md:text-base">
      <span className="font-medium">
        New firms added in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
        {timeLeft.seconds}s
      </span>
    </div>
  );
};

export default CountdownBanner;