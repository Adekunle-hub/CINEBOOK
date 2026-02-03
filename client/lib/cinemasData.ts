

export interface Cinema {
  id: string;
  name: string;
  rating: string;
  directions: string;
  phoneNumber?: string;
  images: string[];
  latitude?: number;
  longitude?: number;
  placeId?: string;
}


export const partnerCinemas: Cinema[] = [
  {
    id: "1",
    name: "Filmhouse Cinemas Ventura Mall",
    rating: "4.0",
    directions: "Ventura Mall, Samonda, Ibadan, Oyo State, Nigeria",
    images: ["/cinema.webp","/cinema.webp","/cinema.webp","/cinema.webp"]
  },
  {
    id: "2",
    name: "Viva Cinemas",
    rating: "4.0",
    directions: "The Palms Shopping Mall, MKO Abiola Way, New GRA, Ibadan, Oyo State, Nigeria",
    phoneNumber: "0817 215 1180",
    images: []
  },
  {
    id: "3",
    name: "Filmhouse Cinemas Dugbe Ibadan",
    rating: "4.0",
    directions: "Dugbe, Ibadan, Oyo State, Nigeria",
    phoneNumber: "0813 335 3929",
    images: []
  },
  {
    id: "4",
    name: "Mcrystal Cinemas Ibadan",
    rating: "4.0",
    directions: "Ace Mall, Bodija–Mokola Road, Ibadan, Oyo State, Nigeria",
    images: []
  },
  {
    id: "5",
    name: "Cocoa Mall Cinema",
    rating: "3.8",
    directions: "Cocoa Mall, Dugbe, Ibadan, Oyo State, Nigeria",
    images: []
  },
  {
    id: "6",
    name: "Destiny Cinema",
    rating: "3.5",
    directions: "Adegbayi Area, Ibadan, Oyo State, Nigeria",
    images: []
  },
  {
    id: "7",
    name: "CeH Cinema",
    rating: "3.6",
    directions: "Kenneth Dike Road, Bodija, Ibadan, Oyo State, Nigeria",
    images: []
  },
  {
    id: "8",
    name: "Ibadan Civic Centre",
    rating: "3.7",
    directions: "Agodi, Ibadan, Oyo State, Nigeria",
    images: []
  },
  {
    id: "9",
    name: "ADLAM Film Academy & Screening Centre",
    rating: "3.6",
    directions: "Jago Area, Ibadan, Oyo State, Nigeria",
    images: []
  },
  {
    id: "10",
    name: "Oduduwa Hall",
    rating: "3.5",
    directions: "University of Ibadan, Ibadan, Oyo State, Nigeria",
    images: []
  }
];
