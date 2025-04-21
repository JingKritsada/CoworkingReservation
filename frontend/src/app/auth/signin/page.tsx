"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { signIn, getSession } from "next-auth/react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setSuccess("Login successful! Redirecting...");

      const updatedSession = await fetch("/api/auth/session").then((res) =>
        res.json()
      );

      router.push("/"); // Redirect to home page
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login. Try again.");
    } finally {
      setLoading(false);
      setDotCount(0);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center">Sign In</h2>

        {error && (
          <p className="text-red-500 text-basae text-center mt-2">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-base text-center mt-2">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? `Signing In${".".repeat(dotCount + 1)}` : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
