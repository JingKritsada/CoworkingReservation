export default async function getBooking(token: string, userId: string) {
  const response = await fetch(
    `https://coworking-reservation-backend.vercel.app/api/v1/reservations`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }

  const data = await response.json();

  const userBookings = data.data.filter(
    (booking: any) => booking.user.id === userId
  );

  return data;
}

export async function deleteBooking(token: string, reservationId: string) {
  const response = await fetch(
    `https://coworking-reservation-backend.vercel.app/api/v1/reservations/${reservationId}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete reservation");
  }

  return await response.json();
}

export async function updateBooking(
  token: string,
  reservationId: string,
  updatedData: {
    reservation_date: string;
    // Add other fields if your API requires them
  }
) {
  const response = await fetch(
    `https://coworking-reservation-backend.vercel.app/api/v1/reservations/${reservationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update reservation");
  }

  return await response.json();
}

export async function createBooking(
  token: string,
  bookingData: {
    space_id: number;
    reservation_date: string;
  }
) {
  const response = await fetch(
    `https://coworking-reservation-backend.vercel.app/api/v1/spaces/${bookingData.space_id}/reservations/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reservation_date: bookingData.reservation_date,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create booking");
  }

  return await response.json();
}
