import { Cinema } from "@/lib/cinemasData";
import { MapPin, Phone, Star } from "lucide-react";

const CinemaCard = ({ cinema }: { cinema: Cinema }) => {
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

  

const cinemaImageMap = Object.fromEntries(
  cinemas.map(c => [c.name, c.src])
);

const displayImage =
  cinema.images?.length > 0
    ? cinema.images[0]
    : cinemaImageMap[cinema.name] ?? "/cinema.webp";



  return (
    <div className="bg-white max-w-fit mt-4 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="grid grid-cols-4 gap-2 ">
        <div className="col-span-4 row-span-2 overflow-hidden rounded-lg">
          <img
            src={displayImage}
            alt={`${cinema.name} main view`}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Cinema Information */}
      <div className="p-3 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold text-gray-900 leading-tight pr-2">
            {cinema.name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">
              {cinema.rating}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 text-gray-600">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
            <p className="text-sm leading-relaxed">{cinema.directions}</p>
          </div>

          {cinema.phoneNumber && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 shrink-0 text-green-600" />
              <a
                href={`tel:${cinema.phoneNumber}`}
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                {cinema.phoneNumber}
              </a>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow">
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinemaCard;
