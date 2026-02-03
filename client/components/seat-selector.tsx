"use client";

import type React from "react";
import { useState } from "react";
import type { Seat } from "@/lib/mock-data";
import { useUIContext } from "@/lib/ui-context";

interface SeatSelectorProps {
  seats: Seat[];
  onSeatsSelected: (seats: string[]) => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  seats,
  onSeatsSelected,
}) => {
  const { selectedSeats, setSelectedSeats } = useUIContext();

  const toggleSeat = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  // Group seats by row
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    },
    {} as Record<string, Seat[]>,
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted border border-border"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted-foreground/20"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-2xl h-12 bg-linear-to-r from-transparent via-primary/20 to-transparent rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-muted-foreground">
            SCREEN
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-2 justify-center">
            <span className="w-6 text-center text-sm font-semibold text-muted-foreground">
              {row}
            </span>
            <div className="flex gap-2">
              {rowSeats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat.id, seat.booked)}
                  disabled={seat.booked}
                  className={`w-8 h-8 rounded text-xs font-semibold transition-all duration-200 ${
                    seat.booked
                      ? "bg-muted-foreground/20 cursor-not-allowed text-muted-foreground/50"
                      : selectedSeats.includes(seat.id)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground border border-border hover:border-primary hover:bg-muted/80"
                  }`}
                  title={`Seat ${seat.id}`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
            <span className="w-6 text-center text-sm font-semibold text-muted-foreground">
              {row}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-3">
          Selected Seats:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-sm font-semibold text-primary">
            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        )}
      </div>
    </div>
  );
};
