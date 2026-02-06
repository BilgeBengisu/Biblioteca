import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const msgArray = [
  "Encuentra tu próxima\nhistoria", 
  "Encuentra tu próxima\naventura", 
  "Encuentra tu próxima\nnovela", 
  "Encuentra tu próxima\nlectura", 
  "Encuentra tu próxima\nobra favorita",
  "Bienvenido a Biblioteca"
];

const buttonClasses =
  "px-5 py-2.5 rounded-full bg-red-500 !text-white font-semibold shadow hover:shadow-md hover:bg-red-700 transition";//!text-white overrides global css for the link color

export const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev === msgArray.length - 1) {
          clearInterval(interval);  // stop interval
          setIsActive(false);       // optional
          return prev;              // stay on last message
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div className="min-h-screen white text-red">
      <main className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 pt-24 sm:pt-32">
        {/* Fixed-height wrapper */}
        <div className="h-32 flex items-end">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm"
            id="landing-msg"
            style={{ textAlign: "right", whiteSpace: "pre-line" }}
          >
            {msgArray[currentIndex]}
          </h1>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <Link
            to="/books"
            className={buttonClasses}
          >
            Explorar libros
          </Link>
          <Link
            to="/register"
            className={buttonClasses}
          >
            Comenzar ahora
          </Link>
        </div>
      </main>
    </div>
  );
}

