"use client";
import type React from "react";
import Link from "next/link";
import { Movie } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link href={`/movie/${movie._id}`}>
      <Card className="overflow-hidden  w-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="relative overflow-hidden h-64 bg-muted">
          <img
            src={movie.image?.url || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="w-full">
              <div className="flex items-center justify-between text-white">
                <span className="font-semibold">{movie.duration}</span>
                <span className="text-accent">
                  ★ {movie.rating[0] || movie.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 md:p-4">
          <h3 className="font-bold text-lg leading-tight p-1 md:mb-2 text-card-foreground">
            {movie.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genre && (Array.isArray(movie.genre)
              ? movie.genre
              : movie.genre.split(",")
            ).map((g) => {
              const trimmedGenre = g.trim();
              return (
                <Badge
                  key={trimmedGenre}
                  variant="secondary"
                  className="text-xs"
                >
                  {trimmedGenre}
                </Badge>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {movie.description}
          </p>
        </div>
      </Card>
    </Link>
  );
};
