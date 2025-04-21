"use client";

import { useEffect, useState } from "react";
import getBooking, { deleteBooking } from "@/libraries/bookingAPI";
import getUserProfile from "@/libraries/userAPI";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { updateBooking } from "@/libraries/bookingAPI";
import { Session } from "inspector/promises";
import Banner from "@/components/Banner";

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getMaxDate() {
  const max = new Date();
  max.setMonth(max.getMonth() + 1); // add 1 month
  return max.toISOString().split("T")[0];
}

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sessionAvailable, setSessionAvailable] = useState(true); // <== NEW
  const [selectedDates, setSelectedDates] = useState<{ [id: string]: string }>(
    {}
  );
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadBookings = async () => {
      const session = await getSession();
      if (!session) {
        setSessionAvailable(false); // session doesn't exist
        setLoading(false); // stop loading spinner
        return;
      }

      const token = session.user.token;
      setToken(token);

      try {
        const me = await getUserProfile(token);
        console.log("Logged-in user:", me);
        setCurrentUser(me.data); // Save the logged-in user info

        let bookingRes;

        if (me.role === "admin") {
          bookingRes = await getBooking(token, ""); // backend returns all bookings
        } else {
          bookingRes = await getBooking(token, me.id);
        }
        setBookings(bookingRes.data);
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleDelete = async (reservationId: string) => {
    try {
      await deleteBooking(token, reservationId);
      setBookings((prev) =>
        prev.filter((booking) => booking.reservation_id !== reservationId)
      );
    } catch (error: any) {
      alert(error.message || "Failed to delete booking");
    }
  };

  const handleDateChange = async (reservationId: string, newDate: string) => {
    const confirmChange = window.confirm(
      "Are you sure you want to change the reservation date?"
    );

    if (!confirmChange) return;

    try {
      await updateBooking(token, reservationId, {
        reservation_date: newDate,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.reservation_id === reservationId
            ? { ...b, reservation_date: newDate }
            : b
        )
      );

      setSelectedDates((prev) => ({
        ...prev,
        [reservationId]: newDate,
      }));
    } catch (error: any) {
      alert(error.message || "Failed to update reservation");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mt-24 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-gray-500">Loading your bookings...</p>
      </div>
    );
  }

  if (!sessionAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-24 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
          <img
            src="/images/loginfirst.png"
            alt="Booking illustration"
            className="w-[256px] h-[256px] mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Please log in to view your bookings.
          </h2>
          <Link href="/auth/signin">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  //console.log("Bookings:", bookings);
  console.log("Current user:", currentUser);
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-12 mt-24">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-8">
            <img
              src="/images/nobooking.png"
              alt="Booking illustration"
              className="w-[256px] h-[256px] mb-4"
            />
            <p className="text-gray-600 text-lg mb-4">
              You haven’t made any bookings yet.
            </p>
            <Link href="/reservation">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">
                Make a Reservation
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 text-left">
            {/* Booking list */}
            {bookings.map((booking: any) => (
              <div
                key={booking.reservation_id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition hover:shadow-xl flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      {booking.space.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Address:</strong> {booking.space.address}
                    </p>
                    {currentUser?.role === "admin" && booking.user && (
                      <p className="text-sm text-indigo-600 mt-1">
                        <strong>Booked by:</strong> {booking.user.name} (
                        {booking.user.email})
                      </p>
                    )}
                    <p className="text-gray-600 text-sm">
                      <strong>Reservation Date:</strong>{" "}
                      {new Date(booking.reservation_date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(booking.reservation_id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Change Reservation Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDates[booking.reservation_id] || ""}
                    onChange={(e) =>
                      handleDateChange(booking.reservation_id, e.target.value)
                    }
                    min={getTodayDate()}
                    max={getMaxDate()}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            ))}

            {/* Booking count */}
            <div className="mt-8 flex flex-col items-center">
              <p className="text-gray-700 font-medium mb-3">
                {currentUser?.role === "admin"
                  ? `There are ${bookings.length} bookings`
                  : `You have ${bookings.length}/3 bookings`}
              </p>

              {bookings.length < 3 && (
                <Link href="/reservation">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition">
                    Make Another Reservation
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
