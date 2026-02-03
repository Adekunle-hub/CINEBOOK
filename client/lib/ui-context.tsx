"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Booking } from "./mock-data";

interface UIContextType {
  selectedCinema: string;
  setSelectedCinema: (cinema: string) => void;
  selectedShowTime: string | null;
  setSelectedShowTime: (time: string) => void;
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedShowTime, setSelectedShowTime] = useState<string | null>("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    console.log("Selected cinema changed:", selectedCinema);
  }, [selectedCinema]);

  return (
    <UIContext.Provider
      value={{
        selectedCinema,
        setSelectedCinema,
        selectedShowTime,
        setSelectedShowTime,
        bookings, setBookings,
        selectedSeats,
        setSelectedSeats,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
};
