// Mock data for cinemas, movies, and showtimes
import { getAllPictures } from "@/services/handlePictures";

export interface Movie {
  _id: string;
  title: string;
  description: string;
  duration: string;
  genre: string | string[];
  image: MovieImage;
  images: any[];
  rating: string[];
  createdAt: string;
  __v: number;
}

interface MovieImage {
  url: string;
  publicId: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  time: string;
  price: number;
  availableSeats: number;
}

export interface Cinema {
  id: string;
  name: string;
  location: string;
  city: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  booked: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  movieTitle: string;
  cinemaName: string;
  showtime: string;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
}


// Function to fetch movies from API
export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const movies = await getAllPictures();
    return movies;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return [];
  }
};

// Empty array - movies will be loaded from API
export const movies: Movie[] = [];

export const showtimes: Showtime[] = [
  // "Behind the Scenes" - showing at multiple cinemas
  {
    id: "1",
    movieId: "6976dd1c152921bbdb4c4cfe",
    cinemaId: "1", // Filmhouse Ventura
    time: "14:30",
    price: 3500,
    availableSeats: 45,
  },
  {
    id: "2",
    movieId: "6976dd1c152921bbdb4c4cfe",
    cinemaId: "1", // Filmhouse Ventura
    time: "17:45",
    price: 4000,
    availableSeats: 32,
  },
  {
    id: "3",
    movieId: "6976dd1c152921bbdb4c4cfe",
    cinemaId: "2", // Viva Cinemas
    time: "20:00",
    price: 4500,
    availableSeats: 28,
  },
  {
    id: "4",
    movieId: "6976dd1c152921bbdb4c4cfe",
    cinemaId: "3", // Filmhouse Dugbe
    time: "15:30",
    price: 3500,
    availableSeats: 50,
  },

  // "A Very Dirty Christmas" - popular holiday movie
  {
    id: "5",
    movieId: "6976df1f152921bbdb4c4d06",
    cinemaId: "1", // Filmhouse Ventura
    time: "12:00",
    price: 3500,
    availableSeats: 40,
  },
  {
    id: "6",
    movieId: "6976df1f152921bbdb4c4d06",
    cinemaId: "2", // Viva Cinemas
    time: "15:00",
    price: 4000,
    availableSeats: 42,
  },
  {
    id: "7",
    movieId: "6976df1f152921bbdb4c4d06",
    cinemaId: "4", // Mcrystal
    time: "18:30",
    price: 3500,
    availableSeats: 35,
  },

  // "Queen Lateefah" - showing at multiple venues
  {
    id: "8",
    movieId: "6976deb0152921bbdb4c4d04",
    cinemaId: "2", // Viva Cinemas
    time: "13:00",
    price: 3500,
    availableSeats: 48,
  },
  {
    id: "9",
    movieId: "6976deb0152921bbdb4c4d04",
    cinemaId: "3", // Filmhouse Dugbe
    time: "16:30",
    price: 3500,
    availableSeats: 38,
  },
  {
    id: "10",
    movieId: "6976deb0152921bbdb4c4d04",
    cinemaId: "5", // Cocoa Mall
    time: "19:45",
    price: 3000,
    availableSeats: 30,
  },

  // "Christmas Love Story" - holiday romance
  {
    id: "11",
    movieId: "6976dcd5152921bbdb4c4cfc",
    cinemaId: "1", // Filmhouse Ventura
    time: "11:30",
    price: 3500,
    availableSeats: 45,
  },
  {
    id: "12",
    movieId: "6976dcd5152921bbdb4c4cfc",
    cinemaId: "4", // Mcrystal
    time: "14:00",
    price: 3500,
    availableSeats: 40,
  },
  {
    id: "13",
    movieId: "6976dcd5152921bbdb4c4cfc",
    cinemaId: "6", // Destiny Cinema
    time: "17:00",
    price: 2500,
    availableSeats: 35,
  },

  // "The Black Book" - action thriller
  {
    id: "14",
    movieId: "6976dc0f152921bbdb4c4cf8",
    cinemaId: "2", // Viva Cinemas
    time: "18:15",
    price: 4000,
    availableSeats: 42,
  },
  {
    id: "15",
    movieId: "6976dc0f152921bbdb4c4cf8",
    cinemaId: "3", // Filmhouse Dugbe
    time: "20:30",
    price: 4000,
    availableSeats: 38,
  },
  {
    id: "16",
    movieId: "6976dc0f152921bbdb4c4cf8",
    cinemaId: "4", // Mcrystal
    time: "21:00",
    price: 4500,
    availableSeats: 33,
  },

  // "Jagunjagun" - popular action
  {
    id: "17",
    movieId: "6976db78152921bbdb4c4cf6",
    cinemaId: "1", // Filmhouse Ventura
    time: "19:00",
    price: 4000,
    availableSeats: 55,
  },
  {
    id: "18",
    movieId: "6976db78152921bbdb4c4cf6",
    cinemaId: "2", // Viva Cinemas
    time: "21:30",
    price: 4500,
    availableSeats: 25,
  },
  {
    id: "19",
    movieId: "6976db78152921bbdb4c4cf6",
    cinemaId: "5", // Cocoa Mall
    time: "20:00",
    price: 3500,
    availableSeats: 28,
  },

  // "Where love lives" - romantic drama
  {
    id: "20",
    movieId: "6976de08152921bbdb4c4d02",
    cinemaId: "3", // Filmhouse Dugbe
    time: "13:30",
    price: 3500,
    availableSeats: 45,
  },
  {
    id: "21",
    movieId: "6976de08152921bbdb4c4d02",
    cinemaId: "6", // Destiny Cinema
    time: "15:00",
    price: 2500,
    availableSeats: 40,
  },

  // "Almost moved on" - romantic drama
  {
    id: "22",
    movieId: "6976dd72152921bbdb4c4d00",
    cinemaId: "4", // Mcrystal
    time: "16:00",
    price: 3500,
    availableSeats: 42,
  },
  {
    id: "23",
    movieId: "6976dd72152921bbdb4c4d00",
    cinemaId: "7", // CeH Cinema
    time: "18:00",
    price: 3000,
    availableSeats: 35,
  },

  // "Maid for the season" - seasonal romance
  {
    id: "24",
    movieId: "6976dc73152921bbdb4c4cfa",
    cinemaId: "5", // Cocoa Mall
    time: "14:30",
    price: 3000,
    availableSeats: 38,
  },
  {
    id: "25",
    movieId: "6976dc73152921bbdb4c4cfa",
    cinemaId: "8", // Ibadan Civic Centre
    time: "16:45",
    price: 2500,
    availableSeats: 45,
  },

  // "Oversabi Aunty" - comedy
  {
    id: "26",
    movieId: "6976dadb152921bbdb4c4cf1",
    cinemaId: "6", // Destiny Cinema
    time: "19:30",
    price: 2500,
    availableSeats: 30,
  },
  {
    id: "27",
    movieId: "6976dadb152921bbdb4c4cf1",
    cinemaId: "9", // ADLAM Film Academy
    time: "17:30",
    price: 2000,
    availableSeats: 25,
  },

  // Extra showtimes for popular movies at additional cinemas
  {
    id: "28",
    movieId: "6976dd1c152921bbdb4c4cfe", // Behind the Scenes
    cinemaId: "7", // CeH Cinema
    time: "21:00",
    price: 3000,
    availableSeats: 30,
  },
  {
    id: "29",
    movieId: "6976df1f152921bbdb4c4d06", // A Very Dirty Christmas
    cinemaId: "10", // Oduduwa Hall
    time: "20:00",
    price: 2000,
    availableSeats: 50,
  },
  {
    id: "30",
    movieId: "6976deb0152921bbdb4c4d04", // Queen Lateefah
    cinemaId: "8", // Ibadan Civic Centre
    time: "19:00",
    price: 2500,
    availableSeats: 40,
  },
];



export const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 12;

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        booked: Math.random() > 0.7,
      });
    }
  });

  return seats;
};
