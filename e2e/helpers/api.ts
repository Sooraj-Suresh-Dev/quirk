const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';

export async function createUser(email: string, password: string) {
  return fetch(`${API_BASE}/api/auth/magic-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function getTrends(token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${API_BASE}/api/trends`, { headers });
}

export async function healthCheck() {
  return fetch(`${API_BASE}/api/health`);
}
