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
        {/* Chest background */}
        <div className="absolute inset-0 bg-[#1A1F2C] rounded-lg shadow-xl transform -skew-x-2" />
        
        {/* Chain decorations */}
        <div className="absolute -top-3 left-0 w-full flex justify-between px-2">
          <div className="w-full h-2 bg-[#403E43] rounded-full flex space-x-2">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="w-4 h-4 bg-[#9F9EA1] rounded-full shadow-inner transform -translate-y-1"
                style={{
                  boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), 2px 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Timer Display */}
        <div className="relative bg-[#221F26] px-6 py-4 rounded-lg border-2 border-[#403E43] shadow-inner">
          <div className="text-center space-y-2">
            <div className="font-mono text-xl tracking-wider">
              <span className="text-yellow-400">{timeLeft.days}</span>
              <span className="text-gray-400">d </span>
              <span className="text-yellow-400">{timeLeft.hours}</span>
              <span className="text-gray-400">h </span>
              <span className="text-yellow-400">{timeLeft.minutes}</span>
              <span className="text-gray-400">m </span>
              <span className="text-yellow-400">{timeLeft.seconds}</span>
              <span className="text-gray-400">s</span>
            </div>
          </div>
        </div>

        {/* Additional chain details */}
        <div className="absolute -bottom-2 left-0 w-full flex justify-between px-4">
          <div className="w-1 h-8 bg-gradient-to-b from-[#9F9EA1] to-[#403E43] rounded transform -rotate-12" />
          <div className="w-1 h-8 bg-gradient-to-b from-[#9F9EA1] to-[#403E43] rounded transform rotate-12" />
        </div>
      </div>
    </div>
  );
};