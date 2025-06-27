
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });
    let data;
    try {
      data = await response.json();
    } catch {
      data = undefined;
    }
    if (!response.ok) {
      return { ok: false, error: data?.message || response.statusText };
    }
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Network error' };
  }
}
