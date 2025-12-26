const KEY_SESSION_ID = "patient-demo:sessionId"; // Storage key for sessionId
const KEY_ROLE = "patient-demo:role"; // Storage key for role patient or staff

type Role = "patient" | "staff"; // Allowed roles

// Summary  Check browser environment to avoid SSR errors
const isBrowser = () => typeof window !== "undefined"; // True only in browser

// Summary  Save sessionId and role to localStorage
export const setSession = (sessionId: string, role: Role) => {
  // Store session values
  if (!isBrowser()) return; // Stop on server side
  localStorage.setItem(KEY_SESSION_ID, sessionId); // Save sessionId
  localStorage.setItem(KEY_ROLE, role); // Save role
};

// Summary  Read sessionId and role from localStorage
export const getSession = () => {
  // Load session values
  if (!isBrowser()) return { sessionId: "", role: "" as Role | "" }; // Fallback for SSR
  const sessionId = localStorage.getItem(KEY_SESSION_ID) ?? ""; // Read sessionId
  const role = (localStorage.getItem(KEY_ROLE) ?? "") as Role | ""; // Read role
  return { sessionId, role }; // Return values
};

// Summary  Remove sessionId and role from localStorage
export const clearSession = () => {
  // Clear stored session values
  if (!isBrowser()) return; // Stop on server side
  localStorage.removeItem(KEY_SESSION_ID); // Remove sessionId
  localStorage.removeItem(KEY_ROLE); // Remove role
};
