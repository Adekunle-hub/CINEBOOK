// hooks/use-cinemas.ts
import { useQuery } from "@tanstack/react-query";
import { partnerCinemas, type Cinema } from "@/lib/cinemasData";

export const cinemaKeys = {
  all: ["cinemas"] as const,
  detail: (id: string) => ["cinemas", id] as const,
};

// Get all cinemas
export function useCinemas() {
  return useQuery({
    queryKey: cinemaKeys.all,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return partnerCinemas;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get a specific cinema by ID
export function useCinema(cinemaId: string | null | undefined) {
  return useQuery({
    queryKey: cinemaKeys.detail(cinemaId || ""),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cinema = partnerCinemas.find((c) => c.id === cinemaId);
      return cinema ?? null; // ✅ never undefined
    },
    enabled: !!cinemaId, // Only run if cinemaId exists
    staleTime: 10 * 60 * 1000,
  });
}