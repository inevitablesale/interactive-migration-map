import { useEffect, useState } from "react";

export const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2024-05-29T00:00:00");
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
    <div className="fixed bottom-8 right-8 z-50 w-96 transform transition-transform duration-300">
      <div className="relative">
        {/* Chain decorations */}
        <div className="absolute -top-4 left-0 w-full flex justify-between px-4 pointer-events-none">
          <div className="w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded transform -rotate-12" />
          <div className="w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded transform rotate-12" />
        </div>
        
        {/* Timer Display */}
        <div className="text-red-500 font-mono bg-gray-900 px-2 py-1 rounded">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>
    </div>
  );
};