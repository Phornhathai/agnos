import { z } from "zod"; // Zod library for validation

export const patientSchema = z.object({
  // Form validation schema
  firstName: z.string().min(1, "First Name is required"), // Required text
  middleName: z.string().optional(), // Optional text
  lastName: z.string().min(1, "Last Name is required"), // Required text
  dob: z.string().min(1, "Date of Birth is required"), // Required date string
  gender: z.enum(["Male", "Female", "Other"]), // Allowed gender values
  phone: z.string().regex(/^\+?\d{9,15}$/, "Invalid phone number"), // 9 to 15 digits with optional plus
  email: z.email("Invalid email"), // Must be a valid email
  address: z.string().min(1, "Address is required"), // Required text
  preferredLanguage: z.string().min(1, "Preferred Language is required"), // Required text
  nationality: z.string().min(1, "Nationality is required"), // Required text
  emergencyName: z.string().optional(), // Optional text
  emergencyRelation: z.string().optional(), // Optional text
  religion: z.string().optional(), // Optional text
});

export type PatientFormValues = z.infer<typeof patientSchema>; // Type inferred from schema
