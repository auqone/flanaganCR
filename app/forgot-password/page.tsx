"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)] px-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--background)] rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="text-2xl font-bold">
              Shop
            </Link>
          </div>

          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Enter your email and we&apos;ll send you a reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--accent)] text-[var(--background)] py-3 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <Link
                href="/login"
                className="inline-block bg-[var(--accent)] text-[var(--background)] px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Back to Login
              </Link>
            </div>
          )}

          {!submitted && (
            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
