"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { useUIContext } from "@/lib/ui-context";
import { showtimes } from "@/lib/mock-data";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCinema } from "@/hooks/use-cinema";
import { useMovie } from "@/hooks/use-movies";

const BookCinema = () => {
  const params = useParams();
  const movieId = params.id as string;
  const router = useRouter();

  const {
    selectedShowTime,
    setSelectedShowTime,
    selectedSeats,
    selectedCinema,
  } = useUIContext();
  
  const { isAuthenticated, user } = useAuth();

  // Use React Query hooks instead of empty arrays
  const { data: movie } = useMovie(movieId);
  const { data: cinema } = useCinema(selectedCinema);

  // Filter showtimes by both movie AND cinema
  const cinemaShowtimes = selectedCinema
    ? showtimes.filter(
        (s) => s.movieId === movieId && s.cinemaId === selectedCinema
      )
    : [];

  const currentShowtime = cinemaShowtimes.find((s) => s.id === selectedShowTime);
  const totalPrice =
    currentShowtime && selectedSeats.length > 0
      ? currentShowtime.price * selectedSeats.length
      : 0;

  const handleBooking = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    if (!selectedShowTime || selectedSeats.length === 0) {
      alert("Please select a showtime and seats");
      return;
    }

    const booking = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user?.id,
      movieTitle: movie?.title,
      cinemaName: cinema?.name,
      showtime: currentShowtime,
      seats: selectedSeats,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: "confirmed" as const,
    };

    if (typeof window !== "undefined") {
      try {
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        router.push("/checkout?bookingId=" + booking.id);
      } catch (error) {
        console.error("Failed to save booking:", error);
        alert("Failed to save booking. Please try again.");
      }
    }
  };

  

  

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-32 p-6 space-y-6">
        {/* No cinema selected */}
        {!selectedCinema ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
               Select a cinema to see available showtimes
            </p>
          </div>
        ) : (
          /* Cinema selected - show showtimes */
          <div>
            <h3 className="font-bold text-lg mb-4">Select Showtime</h3>

            {cinemaShowtimes.length > 0 ? (
              <div className="space-y-2">
                {cinemaShowtimes
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((showtime) => (
                    <button
                      key={showtime.id}
                      onClick={() => setSelectedShowTime(showtime.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedShowTime === showtime.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold text-lg">{showtime.time}</p>
                      <p className="text-sm text-muted-foreground">
                        {cinema?.name}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-primary font-semibold">
                          ₦{showtime.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {showtime.availableSeats} seats
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground font-medium">
                  No showtimes available
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This movie is not showing at {cinema?.name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Booking Summary */}
        {selectedShowTime && currentShowtime && (
          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="font-bold">Booking Summary</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Movie</p>
                <p className="font-semibold">{movie?.title}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Cinema</p>
                <p className="font-semibold">{cinema?.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Showtime</p>
                <p className="font-semibold">{currentShowtime.time}</p>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats:</span>
                <span className="font-semibold">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Per Seat:</span>
                <span className="font-semibold">
                  ₦{currentShowtime.price.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary text-lg">
                  ₦{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="w-full cursor-pointer"
            >
              {isAuthenticated ? "Continue to Payment" : "Sign in to Book"}
            </Button>

            {selectedSeats.length === 0 && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Select seats below to continue
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookCinema;