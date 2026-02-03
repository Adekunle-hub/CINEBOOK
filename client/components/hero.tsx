"use client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";
import ImageSlider from "./image-slider";
import { useEffect, useState } from "react";
import Link from "next/link";

const HeroSection = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log("isAuthenticated", isAuthenticated);

  return (
    <section className="relative flex w-[95%] flex-col md:flex-row mx-auto space-y-4 justify-between overflow-hidden bg-linear-to-b from-card to-background md:py-20 py-8">
      <div className="w-full md:w-[65%] px-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 md:mb-4">
            Experience Cinema Like Never Before In Ibadan with Ibadan Movie hub.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8">
            Book your favorite movies across all cinemas network in Ibadan.
            Enjoy the best seats at the best prices and seamless booking
            platform.
          </p>

          {/* Only render after client mount to avoid hydration issues */}
          {isClient && (
            <>
              {/* Show buttons when NOT authenticated */}
              {!isAuthenticated && !isLoading && (
                <div className="flex gap-2 md:gap-4  w-full  ">
                  <Link href="/signup">
                    <Button className="px-8  cursor-pointer">Get Started</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="cursor-pointer">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              {/* Optional: Show something else when authenticated */}
              {isAuthenticated && (
                <div className="flex gap-4">
                  <a
                    href="#movies-section"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("movies-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Button className="px-8 cursor-pointer">
                      Browse Movies
                    </Button>
                  </a>
                  <Link href="/bookings">
                    <Button variant="outline" className="cursor-pointer">
                      My Bookings
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="max-w-full  w-full mx-auto  md:w-[30%] md:mr-4">
        <ImageSlider />
      </div>
    </section>
  );
};

export default HeroSection;
