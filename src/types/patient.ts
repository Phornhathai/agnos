export type PatientStatus = "FILLING" | "INACTIVE" | "SUBMITTED"; // Status shown on staff view

export type PatientDraft = {
  // Patient form data shape
  firstName: string; // Required
  middleName?: string; // Optional
  lastName: string; // Required
  dob: string; // Required date string such as 1992-10-21
  gender: "Male" | "Female" | "Other"; // Required enum value
  phone: string; // Required
  email: string; // Required
  address: string; // Required
  preferredLanguage: string; // Required
  nationality: string; // Required
  emergencyName?: string; // Optional
  emergencyRelation?: string; // Optional
  religion?: string; // Optional
};

export type StaffUpdatePayload = {
  // Payload received by staff from the server
  sessionId: string; // Session room id
  draft: Partial<PatientDraft>; // Can be partial but this demo usually sends full values
  status: PatientStatus; // Current status
  lastActiveAt: number; // Latest activity timestamp
};
