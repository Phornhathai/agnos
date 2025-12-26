"use client";

import { useEffect, useMemo, useRef, useState } from "react"; // React hooks
import { useRouter } from "next/navigation"; // Next router for navigation
import { useForm } from "react-hook-form"; // Form state management
import { zodResolver } from "@hookform/resolvers/zod"; // Connect Zod schema to RHF

import Container from "@/components/Container"; // Page layout wrapper
import StatusBadge from "@/components/StatusBadge"; // Status UI badge
import { patientSchema, type PatientFormValues } from "@/lib/patientSchema"; // Validation schema and form type
import { getSession } from "@/lib/session"; // Read session from localStorage
import { joinSession } from "@/lib/socketClient"; // Create socket and join room
import type { PatientStatus } from "@/types/patient"; // Status type

// Summary  Patient form page with validation and real time sync to staff
export default function PatientPage() {
  // Patient page component
  const router = useRouter(); // Router instance
  const { sessionId } = useMemo(() => getSession(), []); // Read sessionId once from localStorage

  const [status, setStatus] = useState<PatientStatus>("FILLING"); // Local patient status for UI
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Timer ref for debounce

  const form = useForm<PatientFormValues>({
    // Setup react hook form
    resolver: zodResolver(patientSchema), // Validate with Zod schema
    defaultValues: {
      // Default values to avoid undefined
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      preferredLanguage: "",
      nationality: "",
      emergencyName: "",
      emergencyRelation: "",
      religion: "",
    },
    mode: "onChange", // Validate while typing
  });

  const { register, handleSubmit, watch, formState } = form; // RHF helpers

  // Summary  If sessionId is missing redirect back to login
  useEffect(() => {
    // Run after render and on sessionId change
    if (!sessionId) router.push("/"); // No sessionId so go back to login page
  }, [sessionId, router]);

  // Summary  Join socket room then watch form values and emit updates with debounce
  useEffect(() => {
    // Setup real time sync
    if (!sessionId) return; // Stop if sessionId is missing

    const socket = joinSession(sessionId); // Join the room for this sessionId

    const sub = watch((values) => {
      // Listen to any form change
      setStatus("FILLING"); // User is typing so mark as filling

      if (debounceRef.current) clearTimeout(debounceRef.current); // Clear previous timer
      debounceRef.current = setTimeout(() => {
        // Delay to reduce too many events
        socket.emit("patient:update", {
          // Send current draft to server
          sessionId, // Room key
          draft: values, // Latest form values
          status: "FILLING", // Current status
          lastActiveAt: Date.now(), // Activity time
        });
      }, 250); // Debounce delay in ms
    });

    return () => {
      // Cleanup when unmount or deps change
      sub.unsubscribe(); // Stop watching form changes
      if (debounceRef.current) clearTimeout(debounceRef.current); // Clear debounce timer
    };
  }, [watch, sessionId]);

  // Summary  On submit emit final payload so staff can show submitted state
  const onSubmit = (values: PatientFormValues) => {
    // Submit handler
    if (!sessionId) return; // Stop if sessionId is missing
    const socket = joinSession(sessionId); // Ensure the client is joined to the room

    setStatus("SUBMITTED"); // Update local UI status
    socket.emit("patient:submit", {
      // Send submit event to server
      sessionId, // Room key
      draft: values, // Final form values
      status: "SUBMITTED", // Submitted status
      lastActiveAt: Date.now(), // Submit time
    });
  };

  return (
    <Container title="Patient Form">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Session: <span className="font-semibold">{sessionId || "-"}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Responsive grid  1 column on mobile  2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldInput
            label="First Name"
            required
            error={formState.errors.firstName?.message}
          >
            <input
              {...register("firstName")}
              className="input"
              placeholder="First name"
            />
          </FieldInput>

          <FieldInput
            label="Middle Name (optional)"
            error={formState.errors.middleName?.message}
          >
            <input
              {...register("middleName")}
              className="input"
              placeholder="Middle name"
            />
          </FieldInput>

          <FieldInput
            label="Last Name"
            required
            error={formState.errors.lastName?.message}
          >
            <input
              {...register("lastName")}
              className="input"
              placeholder="Last name"
            />
          </FieldInput>

          <FieldInput
            label="Date of Birth"
            required
            error={formState.errors.dob?.message}
          >
            <input {...register("dob")} className="input" type="date" />
          </FieldInput>

          <FieldInput
            label="Gender"
            required
            error={formState.errors.gender?.message}
          >
            <select {...register("gender")} className="input">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FieldInput>

          <FieldInput
            label="Phone Number"
            required
            error={formState.errors.phone?.message}
          >
            <input
              {...register("phone")}
              className="input"
              placeholder="+669xxxxxxxx"
            />
          </FieldInput>

          <FieldInput
            label="Email"
            required
            error={formState.errors.email?.message}
          >
            <input
              {...register("email")}
              className="input"
              placeholder="email@example.com"
            />
          </FieldInput>

          <FieldInput
            label="Preferred Language"
            required
            error={formState.errors.preferredLanguage?.message}
          >
            <input
              {...register("preferredLanguage")}
              className="input"
              placeholder="e g English"
            />
          </FieldInput>

          <FieldInput
            label="Nationality"
            required
            error={formState.errors.nationality?.message}
          >
            <input
              {...register("nationality")}
              className="input"
              placeholder="e g Thai"
            />
          </FieldInput>

          <FieldInput
            label="Religion (optional)"
            error={formState.errors.religion?.message}
          >
            <input
              {...register("religion")}
              className="input"
              placeholder="Religion"
            />
          </FieldInput>

          <FieldInput
            label="Emergency Contact Name (optional)"
            error={formState.errors.emergencyName?.message}
          >
            <input
              {...register("emergencyName")}
              className="input"
              placeholder="Name"
            />
          </FieldInput>

          <FieldInput
            label="Emergency Contact Relationship (optional)"
            error={formState.errors.emergencyRelation?.message}
          >
            <input
              {...register("emergencyRelation")}
              className="input"
              placeholder="Relationship"
            />
          </FieldInput>

          <FieldInput
            label="Address"
            required
            error={formState.errors.address?.message}
            className="md:col-span-2"
          >
            <textarea
              {...register("address")}
              className="input min-h-22.5"
              placeholder="Full address"
            />
          </FieldInput>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <p className="text-xs text-gray-500">
            ข้อมูลจะถูก sync ไปหน้า Staff แบบทันทีระหว่างที่พิมพ์
          </p>

          <button
            type="submit"
            className="rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700 disabled:opacity-50"
            disabled={!formState.isValid} // Disable submit until the form is valid
          >
            Submit
          </button>
        </div>
      </form>
    </Container>
  );
}

/**
 * Summary  Small wrapper for label required mark and error message
 * Kept in the same file to avoid creating another component file
 */
function FieldInput({
  label,
  required,
  error,
  className,
  children,
}: Readonly<{
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <label className="text-sm font-medium">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
