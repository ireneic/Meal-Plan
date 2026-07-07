"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function NavBar() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Image className="text-xl font-bold text-emerald-700 cursor-pointer"
            src="/diet.png"
            width={50}
            height={60}
            alt="Logo"
          />
        </Link>
      </div>

      <div className="space-x-6 flex items-center">
        {isSignedIn && (
          <Link href="/mealplan">
            Mealplan
          </Link>
        )}

        {!isSignedIn && (
          <SignInButton mode="redirect" />
        )}

        {user?.imageUrl && <UserButton />}
      </div>
    </nav>
  );
}