"use client";
import React from "react";

const CinemaCarousel = () => {
  const cinemas = [
    {
      name: "Filmhouse Cinemas Ventura Mall",
      src: "/cinema.webp",
    },
    {
      name: "Viva Cinemas",
      src: "/viva cinema.webp",
    },
    {
      name: "Filmhouse Cinemas Dugbe Ibadan",
      src: "/film house dugbe.webp",
    },
    {
      name: "Mcrystal Cinemas Ibadan",
      src: "/mccrystal.webp",
    },
    {
      name: "Cocoa Mall Cinema",
      src: "/cocoa mall.webp",
    },
    {
      name: "Destiny Cinema",
      src: "/cinema.webp",
    },
    {
      name: "CeH Cinema",
      src: "/cinema.webp",
    },
    {
      name: "Ibadan Civic Centre",
      src: "/cinema.webp",
    },
    {
      name: "ADLAM Film Academy & Screening Centre",
      src: "/ADLMA.webp",
    },
    {
      name: "Oduduwa Hall",
      src: "/cinema.webp",
    },
  ];

  return (
    <div className="overflow-hidden w-screen">
      <div className="relative w-screen">
        <div className="flex animate-scroll">
          {/* First set of images */}
          {cinemas.map((img, idx) => (
            <div key={`first-${idx}`} className="shrink-0 mx-3">
              <div className="relative group rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={img.src}
                  alt={`Cinema ${idx + 1}`}
                  className="w-80 h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-1">
                      {img.name}
                    </h3>
                    <p className="text-gray-300 text-sm">Premium Experience</p>
                  </div>
                </div>
                <div className="absolute inset-0 md:hidden flex">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-1">
                      {img.name}
                    </h3>
                    <p className="text-gray-300 text-sm">Premium Experience</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {cinemas.map((img, idx) => (
            <div key={`second-${idx}`} className="shrink-0 mx-3">
              <div className="relative group rounded-xl shadow-2xl overflow-hidden">
                <img
                  src={img.src}
                  alt={`Cinema ${idx + 1}`}
                  className="w-80 h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-1">
                      Cinema Gallery {idx + 1}
                    </h3>
                    <p className="text-gray-300 text-sm">Premium Experience</p>
                  </div>
                </div>
                <div className="absolute md:hidden flex flex-col inset-0 ">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-1">
                      {img.name}
                    </h3>
                    <p className="text-gray-300 text-sm">Premium Experience</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CinemaCarousel;
