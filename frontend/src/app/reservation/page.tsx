"use client";

import { useState, useEffect } from "react";
import { createBooking } from "@/libraries/bookingAPI";
import getSpaces from "@/libraries/spacesAPI";
import { useSession } from "next-auth/react";
import getBooking from "@/libraries/bookingAPI";
import { deleteBooking } from "@/libraries/bookingAPI";
import getUserProfile from "@/libraries/userAPI";
import Link from "next/link";

export default function BookingForm() {
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxDateObj = new Date();
  maxDateObj.setMonth(today.getMonth() + 1); // Add 1 month
  const maxDate = maxDateObj.toISOString().split("T")[0];
  const { data: session } = useSession();

  const [spaces, setSpaces] = useState<any[]>([]);
  const [spaceId, setSpaceId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getImageForSpace = (space: any) => {
    switch (space.space_id) {
      case 1:
        return "/images/pyramid.jpg";
      case 2:
        return "/images/cat-cafe.png";
      case 3:
        return "/images/moon-lounge.jpg";
      default:
        return "/images/default.jpg";
    }
  };

  const selectedSpace = spaces.find((space) => space.space_id === spaceId);

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const res = await getSpaces();
        setSpaces(res.data); // assuming the response shape is { data: [...] }
      } catch (err) {
        console.error(err);
        setError("Could not load spaces.");
      }
    };
    loadSpaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setIsSubmitting(true); // ⏳ Start loading

    if (!session) {
      setError("You must be logged in.");
      setIsSubmitting(false);
      return;
    }

    if (!spaceId || !date) {
      setError("Please select both space and date.");
      setIsSubmitting(false);
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to book this space on ${date}?`
    );
    if (!confirm) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = session.user.token;

      const me = await getUserProfile(token);
      const existing = await getBooking(token, me.id);
      const sameDayBooking = existing.data.find(
        (b: any) => b.reservation_date.split("T")[0] === date
      );

      if (sameDayBooking) {
        await deleteBooking(token, sameDayBooking.reservation_id);
      }

      await createBooking(token, {
        space_id: spaceId,
        reservation_date: date,
      });

      setSuccess("Booking created successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false); // ✅ Done
    }
  };

  return (
    <main className="min-h-screen mt-32 pt-16 px-8 bg-gray-50 flex flex-col items-center">
      {/* Left image */}
      <div className="flex justify-center items-start gap-10 mb-10">
        <Link href="/hahahoho">
          <img
            src="/images/left-banner.jpg" // change this to your own image path
            alt="Left Banner"
            className="hidden md:block w-48 h-[600px] object-cover rounded-xl border-4 border-transparent animate-borderGlow"
          />
        </Link>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-2xl bg-white shadow-lg rounded-xl p-8"
        >
          <h2 className="text-4xl font-extrabold mb-8 text-center animate-rainbow drop-shadow">
            Book a Space
          </h2>
          <img
            src={
              selectedSpace
                ? getImageForSpace(selectedSpace)
                : "/images/default.png"
            }
            alt="Space"
            className="w-full h-60 object-cover rounded-lg mb-6 shadow transition duration-300 ease-in-out hover:scale-105"
          />

          {/* Space dropdown */}
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">
              Select Space
            </label>
            <select
              value={spaceId ?? ""}
              onChange={(e) => setSpaceId(Number(e.target.value))}
              className="w-full border px-4 py-3 rounded-lg text-lg"
              required
            >
              <option value="" disabled>
                -- Choose a space --
              </option>
              {spaces.map((space) => (
                <option key={space.space_id} value={space.space_id}>
                  {space.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg text-lg"
              required
              min={minDate}
              max={maxDate}
            />
          </div>

          <button
            type="submit"
            className={`flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg w-full transition duration-200 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isSubmitting ? "Booking..." : "Book Now"}
          </button>

          {success && <p className="text-green-500 text-sm">{success}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {/* Right image */}
        <Link href="/hahahoho">
          <img
            src="/images/right-banner.jpg" // change this too
            alt="Right Banner"
            className="hidden md:block w-48 h-[600px] object-cover rounded-xl border-4 border-transparent animate-borderGlow"
          />
        </Link>
      </div>
      {!session && (
        <div className="flex justify-center items-center gap-3 pt-2 border-t mt-4">
          <p className="text-gray-600 text-lg">Not logged in?</p>
          <a
            href="/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-lg transition"
          >
            Sign In
          </a>
        </div>
      )}
    </main>
  );
}
