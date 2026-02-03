"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import CommandSearch from "./search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu, User, LogOut, TicketCheckIcon } from "lucide-react";

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getDisplayName = () => {
    if (!user) return "User";
    if (user.name) return user.name.split(" ")[0];
    if (user.email) {
      const emailPrefix = user.email.split("@")[0];
      const nameParts = emailPrefix
        .split(/[._-]/)
        .filter((part) => part.length > 0);

      const firstName = nameParts[0].replace(/[0-9].*$/, "").trim();

      return (
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      );
    }

    return "User";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">✎</span>
          </div>
          <span className="text-xl font-bold hidden md:block text-primary">
            Ibadan Movie Hub
          </span>
          <span className="text-xl font-bold text-primary block md:hidden">
            IMH
          </span>
        </Link>

        <div className="hidden md:flex">
          <CommandSearch />
        </div>

        {hasMounted && (
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded" />
              </div>
            ) : isAuthenticated ? (
              <>
                {/* Desktop View */}
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/bookings">
                    <Button variant="ghost">My Bookings</Button>
                  </Link>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Welcome, {getDisplayName()}
                    </span>
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Mobile View - Dropdown Menu */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-semibold">{getDisplayName()}</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            {user?.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/bookings" className="flex items-center cursor-pointer">
                          <TicketCheckIcon className="mr-2 h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="text-primary focus:text-primary cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="font-semibold">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                {/* Desktop View - Unauthenticated */}
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/login">
                    <Button variant="ghost" className="cursor-pointer">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="cursor-pointer">Sign Up</Button>
                  </Link>
                </div>

                {/* Mobile View - Unauthenticated */}
                <div className="md:hidden flex items-center ">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="cursor-pointer">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="ghost" size="sm" className="cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
