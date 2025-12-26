"use client";

import { useMemo, useState } from "react"; // React hooks
import { useRouter } from "next/navigation"; // Next router for App Router
import Container from "@/components/Container"; // Layout wrapper
import { setSession, getSession, clearSession } from "@/lib/session"; // LocalStorage helpers

// Summary  Login page for entering sessionId and choosing role then redirect to patient or staff
export default function LoginPage() {
  // Login page component
  const router = useRouter(); // Router instance for navigation
  const saved = useMemo(() => getSession(), []); // Read saved session once if any

  const [sessionId, setSessionId] = useState(saved.sessionId || ""); // Input state for sessionId
  const [error, setError] = useState(""); // Error state for simple validation

  // Summary  Save session and role then redirect to the selected page
  const handleGo = (role: "patient" | "staff") => {
    // Handler for patient or staff button
    const trimmed = sessionId.trim(); // Remove leading and trailing spaces
    if (!trimmed) {
      // Stop if sessionId is empty
      setError("Please enter Session ID"); // Show error message
      return; // Exit early
    }
    setError(""); // Clear error
    setSession(trimmed, role); // Save sessionId and role to localStorage
    router.push(role === "patient" ? "/patient" : "/staff"); // Navigate based on role
  };

  // Summary  Clear saved session to start a fresh flow
  const handleReset = () => {
    // Reset handler
    clearSession(); // Remove session data from localStorage
    setSessionId(""); // Clear input value
    setError(""); // Clear error message
  };

  return (
    <Container title="Login">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Session ID</label>
          <input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)} // Update input state on typing
            placeholder="e g ABC123"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <p className="text-xs text-gray-500">
            ใช้ Session ID เดียวกันทั้ง Patient และ Staff
            เพื่อให้เห็นข้อมูลชุดเดียวกัน
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => handleGo("patient")} // Go to patient page
            className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
          >
            Continue as Patient
          </button>

          <button
            onClick={() => handleGo("staff")} // Go to staff page
            className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
          >
            Continue as Staff
          </button>

          <button
            onClick={handleReset} // Clear session and reset UI
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>
    </Container>
  );
}
