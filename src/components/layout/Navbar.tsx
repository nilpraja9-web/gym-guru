import { BicepsFlexed } from "lucide-react";
import { Link } from "react-router-dom";
import {  UserButton, useUser } from "@clerk/react";


export default function Navbar() {
  
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-(--color-border) bg-(--color-background)/80 backdrop-blur-md">
      <div className="flex max-w-6xl mx-auto px-6 h-16 items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-(--color-foreground)">
          <BicepsFlexed className="w-6 h-6 text-(--color-accent)" />
          <span className="font-semibold text-lg text-(--color-accent)">
            Gym Guru
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex gap-4">
          {user ? (
            <>
              <Link to="/profile">
                <button className="w-20 h-8 text-(--color-foreground) rounded-xl hover:bg-(--color-accent) border-(--color-accent)">
                  My Plan
                </button>
              </Link>
              <UserButton />

             
            </>
          ) : (
            <Link to="/auth/sign-in">
              <button className="w-20 h-8 text-(--color-accent) rounded-xl border border-(--color-accent)">
                Sign In
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}