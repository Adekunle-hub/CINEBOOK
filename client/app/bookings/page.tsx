"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { Booking } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUIContext } from "@/lib/ui-context";

export default function BookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isLoading } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);

  const { bookings, setBookings } = useUIContext();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const userBookings = allBookings.filter(
      (b: Booking) => b.userId === user?.id,
    );
    setBookings(userBookings);

    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [isAuthenticated, user, router, searchParams, isLoading, setBookings]);

  const cancelBookings = (bookingId: string) => {
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updatedBookings = allBookings.filter(
      (b: Booking) => b.id !== bookingId,
    );

    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    const userBookings = updatedBookings.filter(
      (b: Booking) => b.userId === user?.id,
    );
    setBookings(userBookings);
  };

  // Helper function to format showtime
  const formatShowtime = (showtime: any) => {
    if (typeof showtime === "string") {
      return showtime;
    }
    if (typeof showtime === "object" && showtime?.time) {
      return showtime.time;
    }
    return "N/A";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {showSuccess && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 mb-8 text-green-500">
            Payment successful! Your booking is confirmed.
          </div>
        )}

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't booked any movies yet.
            </p>
            <Button onClick={() => router.push("/")}>Browse Movies</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{booking.movieTitle}</h3>
                    <p className="text-muted-foreground">
                      {booking.cinemaName}
                    </p>
                  </div>
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "default" : "secondary"
                    }
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Showtime</p>
                    <p className="font-semibold">
                      {formatShowtime(booking.showtime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-semibold">
                      {Array.isArray(booking.seats)
                        ? booking.seats.join(", ")
                        : booking.seats}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-semibold text-primary">
                      $
                      {typeof booking.totalPrice === "number"
                        ? booking.totalPrice.toFixed(2)
                        : booking.totalPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booked On</p>
                    <p className="font-semibold">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                  >
                    Download Ticket
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelBookings(booking.id)}
                    className="text-destructive cursor-pointer bg-transparent"
                  >
                    Cancel Booking
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
