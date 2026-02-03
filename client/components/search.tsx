"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, Clock, Film } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { searchMovies, Movie } from "../utils/api"; // Import your API client
import { Button } from "./ui/button";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onMovieSelect?: (movieId: string) => void;
}

const RECENT_SEARCHES_KEY = "cinebook_recent_searches";
const MAX_RECENT_SEARCHES = 5;

export const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = "Search for movies...",
  autoFocus = false,
  onMovieSelect,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error("Failed to parse recent searches:", error);
        }
      }
    }
  }, []);

  // Search using your axios API client
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["movies-search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return { movies: [], total: 0 };
      return searchMovies(debouncedQuery);
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const results = data?.movies || [];

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== searchQuery);
      const updated = [searchQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      if (typeof window !== "undefined") {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      }

      return updated;
    });
  }, []);

  const handleSelectMovie = useCallback(
    (movieId: string, title: string) => {
      saveRecentSearch(title);
      setQuery("");
      setIsOpen(false);
      setSelectedIndex(-1);

      if (onMovieSelect) {
        onMovieSelect(movieId);
      } else {
        router.push(`/movie/${movieId}`);
      }
    },
    [router, saveRecentSearch, onMovieSelect],
  );

  const handleRecentSearchClick = useCallback((search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems = results.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;

        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            const movie = results[selectedIndex];
            handleSelectMovie(movie.id, movie.title);
          }
          break;

        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex, handleSelectMovie],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() && results.length >= 0) {
      setIsOpen(true);
    }
  }, [debouncedQuery, results]);

  const showRecentSearches = !query && recentSearches.length > 0 && isOpen;
  const showResults = query && isOpen;
  const showLoading = isLoading || isFetching;

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          className="pl-10 pr-10 h-11"
          aria-label="Search movies"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-results"
          role="combobox"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
            type="button"
          >
            {showLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {(showResults || showRecentSearches) && (
        <div
          id="search-results"
          className="absolute top-full bg-background flex flex-col gap-2 mt-2 w-full border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
          role="listbox"
        >
          {showRecentSearches && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  type="button"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full px-4 py-2.5 hover:bg-muted flex items-center gap-3 text-left transition-colors"
                  type="button"
                >
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          )}

          {showResults && (
            <>
              {showLoading && results.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
                  <p className="text-sm">Searching movies...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-100 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">
                      {results.length}{" "}
                      {results.length === 1 ? "result" : "results"} found
                    </p>
                  </div>
                  <div className="py-1">
                    {results.map((movie: Movie, index: number) => (
                      <Button
                      variant={"ghost"}
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie.id, movie.title)}
                        className={cn(
                          "w-full px-4 py-3 my-2 flex cursor-pointer items-center gap-3 text-left transition-colors",
                          selectedIndex === index
                            ? "bg-muted"
                            : "hover:bg-muted/10",
                        )}
                        role="option"
                        aria-selected={selectedIndex === index}
                        type="button"
                      >
                        <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-muted">
                          {movie.poster ? (
                            <Image
                              src={movie.poster}
                              alt={movie.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm">
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {movie.releaseYear && (
                              <span className="text-xs text-muted-foreground">
                                {movie.releaseYear}
                              </span>
                            )}
                            {movie.genre && movie.genre.length > 0 && (
                              <>
                                {movie.releaseYear && (
                                  <span className="text-xs text-muted-foreground">
                                    •
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground truncate">
                                  {movie.genre.slice(0, 2).join(", ")}
                                </span>
                              </>
                            )}
                          </div>
                          {movie.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-500">
                                ★{" "}
                                {typeof movie.rating === "number"
                                  ? movie.rating.toFixed(1)
                                  : movie.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Film className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm mb-1">No movies found</p>
                  <p className="text-xs text-muted-foreground">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
