"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";
import { useMovies } from "@/hooks/use-movies";
import { Movie } from "@/lib/mock-data";

const GenreFilter = () => {
  const { selectedGenre, setSelectedGenre } = useAuth();

  const { data: movies = [] as Movie[], isLoading } = useMovies();

  const allGenres = movies
    ? Array.from(
        new Set(
          movies.flatMap((m) => {
            if (!m.genre) return [];

            if (typeof m.genre === "string") {
              return m.genre.split(",").map((g) => g.trim());
            }

            if (Array.isArray(m.genre)) {
              return m.genre;
            }

            return [];
          }),
        ),
      )
    : [];

  return (
    <section className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">
          Filter by Genre
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedGenre ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedGenre("")}
            className="cursor-pointer"
          >
            All
          </Button>
          {allGenres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre)}
              className="cursor-pointer "
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreFilter;
