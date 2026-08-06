const API_BASE = 'https://elder.techfoundry360.com/api';

export type Campus = {
  id: string;
  name: string;
};

export type Elder = {
  id: string;
  name: string;
};

export async function fetchCampuses(): Promise<Campus[]> {
  const response = await fetch(`${API_BASE}/campuses`);
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
  const response = await fetch(`${API_BASE}/elders?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to load elders (${response.status})`);
  }
  return response.json();
}