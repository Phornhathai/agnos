import type { PatientStatus } from "@/types/patient"; // Status type

type Props = {
  status: PatientStatus; // Status to display
};

// Summary  StatusBadge shows FILLING INACTIVE SUBMITTED as a small badge
export default function StatusBadge({ status }: Readonly<Props>) {
  // Badge component
  const map = {
    // Text and class mapping for each status
    FILLING: { text: "Active (Filling)", cls: "bg-blue-100 text-blue-700" }, // User is typing
    INACTIVE: { text: "Inactive", cls: "bg-gray-200 text-gray-700" }, // No activity
    SUBMITTED: { text: "Submitted", cls: "bg-green-100 text-green-700" }, // Form is submitted
  } as const;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${map[status].cls}`}
    >
      {map[status].text}
    </span>
  );
}
