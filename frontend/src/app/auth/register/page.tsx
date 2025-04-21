"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/libraries/userAPI";
import { signIn } from "next-auth/react";
import Loading from "@/components/Loading";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 3);
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(name, email, password, telephone, role);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setSuccess("Registration successful! Redirecting...");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to register. Try again.");
    } finally {
      setLoading(false);
      setDotCount(0);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center">Register</h2>

        {error && (
          <p className="text-red-500 text-base text-center mt-2">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-base text-center mt-2">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-3"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-3"
            required
          />
          <input
            type="text"
            placeholder="Telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-3"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-3"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? `Registering${".".repeat(dotCount + 1)}` : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-blue-600">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
