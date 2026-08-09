const API_BASE = 'https://elder-android-backend.onrender.com/api';

// Not secrets — safe to have as real values here (embedded in the app itself).
export const ENTRA_CONFIG = {
  tenantId: '1607456c-506f-4aea-bd09-15a63ec8ad52',
  clientId: '9ae266aa-5a20-409d-8fae-153a6cedf606',
};

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
let adminSessionToken: string | null = null;

// Holds the PKCE code_verifier between launching the Entra sign-in browser
// and the app reopening via the redirect — a plain module variable, not
// React state, since the screen that initiated sign-in may not survive
// the round-trip if expo-router resets the navigation stack on deep link.
let pendingCodeVerifier: string | null = null;

export function setPendingCodeVerifier(verifier: string) {
  pendingCodeVerifier = verifier;
}

export function takePendingCodeVerifier(): string | null {
  const v = pendingCodeVerifier;
  pendingCodeVerifier = null;
  return v;
}

function authHeaders(): HeadersInit {
  if (!sessionToken) {
    throw new Error('Not logged in — enter your We Are Coastal code first.');
  }
  return { Authorization: `Bearer ${sessionToken}` };
}

/**
 * Exchanges a verified Entra ID token for this app's own admin-scoped
 * session token. The backend checks the token's signature/issuer/audience
 * and group membership before issuing one — see elder-android-backend's
 * lib/entraAuth.js and lib/schedulerAuth.js.
 */
export async function loginWithEntraIdToken(idToken: string): Promise<{ name: string }> {
  const response = await fetch(`${API_BASE}/admin-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}) as { error?: string });
    throw new Error(body.error || `Sign-in failed (${response.status})`);
  }

  const data = await response.json();
  adminSessionToken = data.token;
  return { name: data.name };
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

export type WacCode = {
  id: string;
  code: string;
  campus: string;
  classDate: string;
  active: boolean;
};

function adminAuthHeaders(): HeadersInit {
  if (!adminSessionToken) {
    throw new Error('Not signed in as admin.');
  }
  return { Authorization: `Bearer ${adminSessionToken}` };
}

export async function fetchWacCodes(): Promise<WacCode[]> {
  const response = await fetch(`${API_BASE}/wac-codes`, { headers: adminAuthHeaders() });
  if (!response.ok) throw new Error(`Failed to load codes (${response.status})`);
  return response.json();
}

export async function createWacCode(input: {
  code: string;
  campusName: string;
  classDate: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE}/wac-codes`, {
    method: 'POST',
    headers: { ...adminAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}) as { error?: string });
    throw new Error(body.error || `Failed to create code (${response.status})`);
  }
}

export async function deactivateWacCode(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/wac-codes/${id}`, {
    method: 'DELETE',
    headers: adminAuthHeaders(),
  });
  if (!response.ok) throw new Error(`Failed to deactivate code (${response.status})`);
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

export async function fetchDates(
  campusName: string,
  classDate: string,
  dayOfWeek: string = 'Sunday'
): Promise<string[]> {
  const params = new URLSearchParams({ campusName, classDate, dayOfWeek });
  const response = await fetch(`${API_BASE}/dates?${params.toString()}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to load dates (${response.status})`);
  }
  return response.json();
}

export async function fetchTimes(campusName: string, date: string): Promise<string[]> {
  const params = new URLSearchParams({ campusName, date });
  const response = await fetch(`${API_BASE}/times?${params.toString()}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to load times (${response.status})`);
  }
  return response.json();
}

export async function createAppointment(input: {
  campusName: string;
  elderName: string;
  date: string;
  timeSlot: string;
  memberName: string;
  memberEmail: string;
}): Promise<{ emailSent: boolean }> {
  const response = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}) as { error?: string });
    throw new Error(
      body.error ||
        (response.status === 409
          ? 'That time was just booked by someone else. Please pick another.'
          : `Failed to book appointment (${response.status})`)
    );
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
