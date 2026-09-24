import { GoogleAuth } from "google-auth-library";

// Expects the full service-account JSON key as a single-line string
// in the GOOGLE_SERVICE_ACCOUNT_JSON env var (set in Vercel, never committed).
function loadCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is not set. Add the service account key JSON as a Vercel env var."
    );
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }
}

let authClient;

export function getGoogleAuth() {
  if (!authClient) {
    authClient = new GoogleAuth({
      credentials: loadCredentials(),
      scopes: [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
      ],
    });
  }
  return authClient;
}
