const API_BASE = 'https://elder-android-backend.onrender.com/api';

export type Campus = {
  id: string;
  name: string;
};

export type Elder = {
  id: string;
  name: string;
};

// --- Session state ---
// Kept in-memory only (not persisted across app restarts) — the booking
// flow is short (code entry through confirmation), so if the app is fully
// closed mid-flow, re-entering the code on relaunch is an acceptable
// tradeoff for not adding SecureStore complexity yet. Can be upgraded to
// persisted storage later if that turns out to matter in practice.
let sessionToken: string | null = null;

function authHeaders(): HeadersInit {
  if (!sessionToken) {
    throw new Error('Not logged in — enter your We Are Coastal code first.');
  }
  return { Authorization: `Bearer ${sessionToken}` };
}

/**
 * Validates a We Are Coastal class code against the backend. On success,
 * stores the session token for subsequent authenticated calls and returns
 * which campus + class date the code belongs to.
 */
export async function loginWithCode(
  code: string
): Promise<{ campus: string; classDate: string }> {
  const response = await fetch(`${API_BASE}/scheduler-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("That code wasn't recognized. Check it and try again.");
    }
    throw new Error(`Login failed (${response.status})`);
  }

  const data = await response.json();
  sessionToken = data.token;
  return { campus: data.campus, classDate: data.classDate };
}

export async function fetchCampuses(): Promise<Campus[]> {
  const response = await fetch(`${API_BASE}/campuses`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to load campuses (${response.status})`);
  }
  return response.json();
}

export async function fetchElders(
  campusName: string,
  date: string,
  timeSlot: string
): Promise<Elder[]> {
  const params = new URLSearchParams({ campusName, date, timeSlot });
  const response = await fetch(`${API_BASE}/elders?${params.toString()}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to load elders (${response.status})`);
  }
  return response.json();
}
