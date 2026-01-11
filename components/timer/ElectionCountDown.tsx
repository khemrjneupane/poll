"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

// Election date: March 5, 2026
const ELECTION_DATE = new Date("2026-03-05T00:00:00");

export default function HeaderCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = ELECTION_DATE.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex justify-center items-center gap-4">
      <div className="xl:hidden rounded-full overflow-hidden shadow ring-1 ring-white/40">
        <Image
          src="https://c.tenor.com/9Rt9JC45-54AAAAC/nepal-nepali.gif"
          alt="Nepal flag"
          width={80}
          height={80}
          className={`w-8 h-8 md:w-24 md:h-24 rounded-full border-blue-500 transition-all duration-300`}
        />
      </div>
      <div className="flex gap-2 items-center flex-col bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
        {/* Label - hidden on mobile */}

        <h1 className="xl:hidden md:block text-2xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm ">
          Election Countdown
        </h1>
        {/* Countdown digits */}
        <div className="flex items-center  gap-1 xl:gap-1">
          {/* Days */}
          <div className="flex flex-col items-center min-w-[35px]">
            <div className="bg-white text-blue-900 rounded-md px-1 py-1 text-sm font-bold w-full text-center shadow-sm">
              {timeLeft.days.toString().padStart(2, "0")}
            </div>
            <div className="text-white text-xs mt-1">DAYS</div>
          </div>

          <div className="text-yellow-400 font-bold mx-1">:</div>

          {/* Hours */}
          <div className="flex flex-col items-center min-w-[35px]">
            <div className="bg-white text-blue-900 rounded-md px-1 py-1 text-sm font-bold w-full text-center shadow-sm">
              {timeLeft.hours.toString().padStart(2, "0")}
            </div>
            <div className="text-white text-xs mt-1">HRS</div>
          </div>

          <div className="text-yellow-400 font-bold mx-1">:</div>

          {/* Minutes */}
          <div className="flex flex-col items-center min-w-[35px]">
            <div className="bg-white text-blue-900 rounded-md px-1 py-1 text-sm font-bold w-full text-center shadow-sm">
              {timeLeft.minutes.toString().padStart(2, "0")}
            </div>
            <div className="text-white text-xs mt-1">MIN</div>
          </div>

          <div className="text-yellow-400 font-bold mx-1">:</div>

          {/* Seconds */}
          <div className="flex flex-col items-center min-w-[35px]">
            <div className="bg-white text-blue-900 rounded-md px-1 py-1 text-sm font-bold w-full text-center shadow-sm">
              {timeLeft.seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-white text-xs mt-1">SEC</div>
          </div>
        </div>
      </div>
      <div className="xl:hidden rounded-full overflow-hidden shadow ring-1 ring-white/40">
        <Image
          src="https://c.tenor.com/9Rt9JC45-54AAAAC/nepal-nepali.gif"
          alt="Nepal flag"
          width={120}
          height={120}
          className={`w-8 h-8 md:w-24 md:h-24 rounded-full border-blue-500 transition-all duration-300`}
        />
      </div>
    </div>
  );
}
