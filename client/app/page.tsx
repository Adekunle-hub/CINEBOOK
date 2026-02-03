

import HeroSection from "@/components/hero";
import GenreFilter from "@/components/genre-filter";
import MoviesGrid from "@/components/movies-grid";
import Features from "@/components/features";
import Cinemas from "@/components/brands-cinemas";


export default function Home() {
 

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

    <Cinemas/>
      {/* Genre Filter */}


      <GenreFilter />

      {/* Movies Grid */}
      <MoviesGrid />

      {/* Features Section */}
      <Features />
    </div>
  );
}
