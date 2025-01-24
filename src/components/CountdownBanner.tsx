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

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 w-96 transform transition-transform duration-300 hover:scale-105">
      <div className="relative">
        {/* Main chest background with wood texture effect */}
        <div className="absolute inset-0 bg-[#1A1F2C] rounded-lg shadow-xl transform -skew-x-2">
          {/* Wood grain effect */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-transparent via-black to-transparent" />
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]" />
        </div>
        
        {/* Top chain */}
        <div className="absolute -top-3 left-0 w-full flex justify-between px-2">
          <div className="w-full h-3 bg-[#403E43] rounded-full flex space-x-2">
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
        
        {/* Horizontal chains */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
          <div className="flex justify-between px-2">
            <div className="w-full h-2 bg-[#403E43] rounded-full flex space-x-3">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 bg-[#9F9EA1] rounded-full shadow-inner"
                  style={{
                    boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.3), 1px 1px 3px rgba(0,0,0,0.2)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Timer Display */}
        <div className="relative bg-[#221F26] px-6 py-4 rounded-lg border-2 border-[#403E43] shadow-inner">
          {/* Metal corners */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-[#9F9EA1] rounded-tl-lg transform -translate-x-1 -translate-y-1" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-[#9F9EA1] rounded-tr-lg transform translate-x-1 -translate-y-1" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#9F9EA1] rounded-bl-lg transform -translate-x-1 translate-y-1" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#9F9EA1] rounded-br-lg transform translate-x-1 translate-y-1" />
          
          <div className="text-center space-y-2">
            <div className="font-mono text-2xl tracking-wider">
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

        {/* Vertical chains */}
        <div className="absolute -bottom-2 left-0 w-full flex justify-between px-4">
          <div className="w-1 h-12 bg-gradient-to-b from-[#9F9EA1] to-[#403E43] rounded transform -rotate-12" />
          <div className="w-1 h-12 bg-gradient-to-b from-[#9F9EA1] to-[#403E43] rounded transform rotate-12" />
        </div>

        {/* Lock decoration */}
        <div className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2">
          <div className="w-6 h-8 bg-[#9F9EA1] rounded-lg shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-[#221F26] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};