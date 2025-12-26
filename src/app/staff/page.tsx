"use client";

import { useEffect, useMemo, useState } from "react"; // React hooks
import { useRouter } from "next/navigation"; // Next router

import Container from "@/components/Container"; // Page layout wrapper
import StatusBadge from "@/components/StatusBadge"; // Status badge UI
import FieldRow from "@/components/FieldRow"; // Reusable label value row
import { getSession } from "@/lib/session"; // Read session from localStorage
import { joinSession } from "@/lib/socketClient"; // Join socket room
import type {
  PatientDraft,
  PatientStatus,
  StaffUpdatePayload,
} from "@/types/patient"; // Shared types

// Summary  Staff page listens to staff update and renders patient fields in real time with inactive detection
export default function StaffPage() {
  // Staff page component
  const router = useRouter(); // Router instance
  const { sessionId } = useMemo(() => getSession(), []); // Read sessionId once

  const [draft, setDraft] = useState<Partial<PatientDraft>>({}); // Latest patient form values
  const [status, setStatus] = useState<PatientStatus>("INACTIVE"); // Latest status from payload
  const [lastActiveAt, setLastActiveAt] = useState<number>(0); // Latest activity timestamp
  const [hasData, setHasData] = useState(false); // Flag to show empty state or data state

  // Summary  If sessionId is missing redirect back to login
  useEffect(() => {
    // Run after render and on sessionId change
    if (!sessionId) router.push("/"); // No sessionId so go back to login page
  }, [sessionId, router]);

  // Summary  Join room and listen to staff update to refresh UI
  useEffect(() => {
    // Setup socket listener
    if (!sessionId) return; // Stop if sessionId is missing
    const socket = joinSession(sessionId); // Join room for this sessionId

    const handler = (payload: StaffUpdatePayload) => {
      // Handle incoming payload from server
      setHasData(true); // Mark that staff has received at least one payload
      setDraft(payload.draft ?? {}); // Save latest draft values
      setStatus(payload.status); // Save latest status
      setLastActiveAt(payload.lastActiveAt); // Save latest activity time
    };

    socket.on("staff:update", handler); // Subscribe to staff update event
    return () => {
      // Cleanup on unmount or deps change
      socket.off("staff:update", handler); // Unsubscribe the listener
    };
  }, [sessionId]);

  // Summary  Compute the final status for UI using lastActiveAt and priority rules
  const computedStatus = useMemo(() => {
    // Derived status for the badge
    if (status === "SUBMITTED") return "SUBMITTED" as const; // Submitted always wins
    if (!lastActiveAt) return "INACTIVE" as const; // No activity yet
    const diff = Date.now() - lastActiveAt; // Time since last activity
    return diff > 10_000 ? ("INACTIVE" as const) : ("FILLING" as const); // Over 10 seconds means inactive
  }, [status, lastActiveAt]);

  const lastActiveText = useMemo(() => {
    // Format lastActiveAt as a readable string
    if (!lastActiveAt) return "-"; // No timestamp yet
    return new Date(lastActiveAt).toLocaleString(); // Convert timestamp to local time text
  }, [lastActiveAt]);

  return (
    <Container title="Staff View">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="text-sm text-gray-600">
          Session: <span className="font-semibold">{sessionId || "-"}</span>
          <div className="text-xs text-gray-500">
            Last active: {lastActiveText}
          </div>
        </div>
        <StatusBadge status={computedStatus} />
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldRow label="First Name" value={draft.firstName} />
          <FieldRow label="Middle Name" value={draft.middleName} />
          <FieldRow label="Last Name" value={draft.lastName} />
          <FieldRow label="Date of Birth" value={draft.dob} />
          <FieldRow label="Gender" value={draft.gender} />
          <FieldRow label="Phone Number" value={draft.phone} />
          <FieldRow label="Email" value={draft.email} />
          <FieldRow
            label="Preferred Language"
            value={draft.preferredLanguage}
          />
          <FieldRow label="Nationality" value={draft.nationality} />
          <FieldRow label="Religion" value={draft.religion} />
          <FieldRow
            label="Emergency Contact Name"
            value={draft.emergencyName}
          />
          <FieldRow
            label="Emergency Relationship"
            value={draft.emergencyRelation}
          />
          <div className="md:col-span-2">
            <FieldRow label="Address" value={draft.address} />
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg border bg-gray-50 text-sm text-gray-700">
          Waiting for patient input…
          <div className="text-xs text-gray-500 mt-1">
            เปิดหน้า Patient ด้วย Session ID เดียวกัน แล้วเริ่มพิมพ์ข้อมูล
          </div>
        </div>
      )}
    </Container>
  );
}
