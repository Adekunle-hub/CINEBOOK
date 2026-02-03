"use client";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { MovieCard } from "./movie-card";
import { Movie, Showtime, showtimes } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { getAllPictures } from "@/services/handlePictures";
import { useMovies } from "@/hooks/use-movies";
import { Skeleton } from "./ui/skeleton";

const MoviesGrid = () => {
  const { selectedGenre } = useAuth();
  const { data: movies = [], isLoading, isError } = useMovies();

  if (isLoading) {
    return (
      <section id="movies-section" className="container mx-auto p-4">
        <Skeleton className="h-9 w-96 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-100 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) return <div>Failed to load movies</div>;

  const filteredMovies = selectedGenre
    ? movies.filter((m) => {
        if (Array.isArray(m.genre)) {
          return m.genre.includes(selectedGenre);
        }
        if (typeof m.genre === "string") {
          const genres = m.genre.split(",").map((g) => g.trim());
          return genres.includes(selectedGenre);
        }
        return false;
      })
    : movies;

  const getShowtimesForMovie = (movieId: string): Showtime[] => {
    return showtimes.filter((s) => s.movieId === movieId);
  };

  return (
    <section id="movies-section" className="container mx-auto p-2 md:p-4">
      <h2 className="text-lg text-center md:text-left sm:text-xl md:text-3xl font-bold mb-4">
        Now Showing at our various cinemas in Ibadan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No movies available
          </div>
        ) : (
          filteredMovies.map((movie) => (
            <div key={movie._id}>
              <MovieCard movie={movie} />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default MoviesGrid;