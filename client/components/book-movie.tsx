"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { movies, showtimes, generateSeats } from "@/lib/mock-data";
import { fetchMovies, type Movie } from "@/lib/mock-data";
import { SeatSelector } from "@/components/seat-selector";

import { Card } from "@/components/ui/card";

import { MovieCard } from "@/components/movie-card";

import SelectCinema from "@/components/select-cinema";
import BookCinema from "@/components/book-cinema";
import { partnerCinemas } from "@/lib/cinemasData";
import { useUIContext } from "@/lib/ui-context";
import { useMovie } from "@/hooks/use-movies";

const BookMoviePage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { selectedShowTime } = useUIContext();

  const movieShowtimes = showtimes.filter((s) => s.movieId === id);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [seats] = useState(generateSeats());

  const { data: movie, isLoading, isError, error } = useMovie(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load movie</p>
          <p className="text-sm text-muted-foreground">{error?.message}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary hover:underline"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  const currentShowtime = movieShowtimes.find((s) => s.id === selectedShowTime);
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

    const cinema = partnerCinemas.find(
      (c) => c.id === currentShowtime!.cinemaId,
    );
    const booking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      movieTitle: movie.title,
      cinemaName: cinema?.name || "Unknown Cinema",
      showtime: currentShowtime!.time,
      seats: selectedSeats,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: "confirmed" as const,
    };

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    router.push("/checkout?bookingId=" + booking.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="text-primary cursor-pointer hover:underline mb-8 flex items-center gap-1"
        >
          ← Back to movies
        </button>

        <section className="md:flex hidden  flex-warp gap-4 w-full">
          <div className="w-full  md:w-[70vw]  flex gap-4 md:gap-8">
            <MovieCard movie={movie} />

            <SelectCinema />
          </div>
          <div className=" w-full md:w-[30vw] ">
            {/* Booking Sidebar */}
            <BookCinema />
          </div>
        </section>
        <section className="md:hidden flex flex-col md:flex-row flex-warp gap-4 w-full">
          <div className="flex flex-col gap-6 w-full">
            <MovieCard movie={movie} />

            <SelectCinema />
          </div>

          <div className=" w-full md:w-[30vw] ">
            {/* Booking Sidebar */}
            <BookCinema />
          </div>
        </section>

        {/* Seat Selection */}
        {selectedShowTime && (
          <div className="mt-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-8">Select Your Seats</h2>
              <SeatSelector seats={seats} onSeatsSelected={setSelectedSeats} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookMoviePage;
