import React, { useState, FormEvent, JSX } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to log in: " + (error as Error).message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Nexus
          </h1>
          <p className="mt-2 text-gray-400">Your gaming community awaits</p>
        </div>

        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-purple-900/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

          <h2 className="text-2xl font-bold text-white mb-6">Log In</h2>

          <div className="bg-red-900/20 border border-red-800/30 text-red-300 px-4 py-3 rounded-lg mb-6 hidden">
            Failed to log in: Invalid credentials
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-gray-900/50 border border-gray-700 focus:border-cyan-500 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-gray-900/50 border border-gray-700 focus:border-cyan-500 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-purple-900/30"
              >
                Log In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Need an account?{" "}
            <a
              href="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
