"use client";

import React, { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { useMovies } from "@/hooks/use-movies";

const ImageSlider = () => {
  const { data: movies, isLoading, isError } = useMovies();
  const [api, setApi] = React.useState<CarouselApi>();

  const images =
    movies?.map((movie) => ({
      id: movie._id,
      imgSrc: movie.image.url,
      name: movie.title,
    })) || [];

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [api]);

  if (isLoading)
    return (
      <main className="flex items-center">
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            <CarouselItem>
              <Card>
                <CardContent className="relative aspect-square p-0">
                  <Image
                    src={"/oversabi-aunty.webp"}
                    alt="oversabi aunty"
                    fill
                    className="object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </main>
    );

  if (isError) return <div>Error loading movies</div>;
  if (!images.length) return <div>No movies found</div>;

  return (
    <main className="flex items-center justify-center">
      <Carousel
        className="w-full max-w-xs  transition-all"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        
        }}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <Card>
                <CardContent className="relative aspect-square p-0">
                  <Image
                    src={image.imgSrc}
                    alt={image.name}
                    fill
                    className="object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer hidden md:block" />
        <CarouselNext className="cursor-pointer hidden md:block" />
      </Carousel>
    </main>
  );
};

export default ImageSlider;