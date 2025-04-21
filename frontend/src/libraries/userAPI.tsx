const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://coworking-reservation-backend.vercel.app/api/v1";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  telephone: string,
  role: string
) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      telephone,
      role,
    }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || "Failed to register user");
  }

  return responseBody;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get user profile");
  }

  return await response.json();
}

export async function logoutUser() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get user profile");
  }

  return await response.json();
}

export default async function getUserProfile(token: string) {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user profile");
  }

  return await response.json();
}

export async function updateUser(
  token: string,
  userId: string,
  userData: {
    name?: string;
    email?: string;
    password?: string;
    telephone?: string;
    role?: string;
  }
) {
  const response = await fetch(`${BASE_URL}/auth/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update user");
  }

  return await response.json();
}

export async function deleteUser(token: string, userId: string) {
  const response = await fetch(`${BASE_URL}/auth/${userId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete user");
  }

  return await response.json();
}
