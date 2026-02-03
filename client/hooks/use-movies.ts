import { fetchMovies, type Movie } from "@/lib/mock-data";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const movieKeys = {
  all: ["movies"] as const,
  detail: (id: String) => ["movies", id] as const,
};

export function useMovies() {
  return useQuery({
    queryKey: movieKeys.all,
    queryFn: fetchMovies,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMovie(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: async (): Promise<Movie | undefined> => {
      const cachedMovies = queryClient.getQueryData<Movie[]>(movieKeys.all);
      if (cachedMovies) {
        const movie = cachedMovies.find((m) => m._id === id);
        if (movie) return movie;
      }

      const movies = await fetchMovies();
      return movies.find((m) => m._id === id);
    },

    enabled: !!id,
  });
}
