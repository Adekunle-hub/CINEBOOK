import axios from "axios";


const backend = process.env.NEXT_PUBLIC_API_URL
const api = axios.create({
  baseURL: backend || 'http://localhost:5000',
  withCredentials: true,
});

let accessToken = "";
export const setAccessToken = (token: string) => {
  accessToken = token;
  console.log("Access token saved:", token);
};

export const getAccessToken = () => {
  return accessToken;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Fixed: Added =
    }
    console.log("Sending request to", config.url);
    console.log("With token:", accessToken ? "Yes" : "No");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("Request failed:", error.response?.status);
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Access token expired! Trying to refresh...");
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post(
          `${backend}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        console.log("Got new access token!");
        accessToken = data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        console.log("Retrying original request...");
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed! Redirecting to login...");
        accessToken = "";
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ===== NEW: Search API Functions =====

export interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseYear?: number;
  genre?: string[];
  rating?: number;
  description?: string;
  duration?: number;
}

export interface SearchResponse {
  movies: Movie[];
  total: number;
  query?: string;
}

/**
 * Search for movies/posts
 */
export const searchMovies = async (query: string): Promise<SearchResponse> => {
  try {
    const { data } = await api.get<SearchResponse>(`/search`, {
      params: { q: query }
    });
    return data;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

/**
 * Get all posts/movies
 */
export const getAllMovies = async () => {
  try {
    const { data } = await api.get("/upload/posts");
    return data;
  } catch (error) {
    console.error("Get all movies error:", error);
    throw error;
  }
};

/**
 * Get single post/movie by ID
 */
// export const getMovieById = async (id: string) => {
//   try {
//     const { data } = await api.get(`//${id}`);
//     return data;
//   } catch (error) {
//     console.error("Get movie error:", error);
//     throw error;
//   }
// };

export default api;