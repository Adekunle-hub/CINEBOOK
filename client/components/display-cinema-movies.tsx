import { getAllPictures } from "@/services/handlePictures";
import React, { useEffect, useState } from "react";


interface MovieImage {
  url: string;
  publicId: string;
}

interface Movie {
  _id: string;
  title: string;
  description: string;
  duration: string;
  genre: string;
  image: MovieImage;
  images: any[];
  rating: string[];
  createdAt: string;
  __v: number;
}

const DisplayCinemaMovies = () => {
  const [images, setImages] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await getAllPictures();
        setImages(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load the pictures");
        }
      } finally {
        setLoading(false);
      }
      console.log("Real Images", images);
    };

    fetchImages();
  }, []);

  if (loading) return <h1> Loading cinema movies...</h1>;
  if (error) return <div className="text-red-500 p-4">Error:{error}</div>;
  return (
   <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cinema Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((item, index) => (
          <div key={item._id || index} className="border rounded-lg overflow-hidden shadow-lg">
            <img
              src={item.image?.url}
              alt={item.title || `Movie ${index + 1}`}
              className="w-full h-64 object-cover cover-top"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm mt-2">{item.description}</p>
              )}
              <div className="mt-3 flex gap-4 text-sm text-gray-500">
                {item.genre && <span>{item.genre}</span>}
                {item.duration && <span>{item.duration}</span>}
              </div>
              {item.rating && item.rating.length > 0 && (
                <div className="mt-2">
                  <span className="text-yellow-500 font-semibold">
                    ⭐ {item.rating[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-gray-500">No cinema movies available</p>
      )}
    </div>
  );
};

export default DisplayCinemaMovies;
