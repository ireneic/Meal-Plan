"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg mb-12 p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Personalized AI Meal Plans
        </h1>

        <p className="text-xl mb-6">
          Let our AI do the planning. You focus on cooking and enjoying!
        </p>

        <Link
          href="/sign-up"
          className="inline-block rounded bg-white px-5 py-3 font-medium text-emerald-500 transition-colors hover:bg-gray-100"
        >
          Get Started
        </Link>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mb-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold">
            How It Works
          </h2>

          <p className="mt-2 text-gray-600">
            Follow these simple steps to get your personalized meal plan
          </p>
        </div>

        <div className="flex flex-col items-start justify-center space-y-8 md:flex-row md:space-y-0 md:space-x-8">

          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7m-3-3h6"
                />
              </svg>
            </div>

            <h3 className="mb-2 text-xl font-medium">
              Create an Account
            </h3>

            <p className="text-center text-gray-600">
              Sign up or sign in to access your personalized meal plans.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6"
                />
              </svg>
            </div>

            <h3 className="mb-2 text-xl font-medium">
              Set Your Preferences
            </h3>

            <p className="text-center text-gray-600">
              Input your dietary preferences and goals to tailor your meal
              plans.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="mb-2 text-xl font-medium">
              Receive Your Meal Plan
            </h3>

            <p className="text-center text-gray-600">
              Get your customized meal plan delivered weekly to your account.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}