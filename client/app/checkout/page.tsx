"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { Booking } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
      router.push("/");
      return;
    }

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const foundBooking = bookings.find((b: any) => b.id === bookingId);
    if (foundBooking) {
      console.log('Found booking:', foundBooking);
      setBooking(foundBooking);
    }
  }, [isAuthenticated, router, searchParams]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!cardNumber || !cardName || !expiry || !cvc) {
      setError("Please fill in all payment details");
      setLoading(false);
      return;
    }

    if (cardNumber.length < 13 || cardNumber.length > 19) {
      setError("Invalid card number");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/bookings?success=true");
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Helper function to safely render showtime
// Helper function to safely render showtime
const getShowtimeDisplay = () => {
  if (!booking.showtime) return 'N/A';
  if (typeof booking.showtime === 'string') return booking.showtime;
  if (typeof booking.showtime === 'object' && 'time' in booking.showtime) {
    return (booking.showtime as any).time; // Extract time from object
  }
  return 'N/A';
};

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Complete Your Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-xl font-bold mb-6">Card Details</h2>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    required
                    className="mt-2 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      type="text"
                      value={cvc}
                      onChange={(e) =>
                        setCvc(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="123"
                      maxLength={4}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                  size="lg"
                >
                  {loading
                    ? "Processing..."
                    : `Pay $${booking.totalPrice.toFixed(2)}`}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-32">
              <h2 className="font-bold text-lg mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 border-b border-border pb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Movie</p>
                  <p className="font-semibold">{booking.movieTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cinema</p>
                  <p className="font-semibold">{booking.cinemaName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Showtime</p>
                  <p className="font-semibold">{getShowtimeDisplay()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seats</p>
                  <p className="font-semibold">
                    {Array.isArray(booking.seats) 
                      ? booking.seats.join(", ") 
                      : String(booking.seats)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fees</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}