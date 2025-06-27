export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });
    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      return {
        success: false,
        data: undefined,
        error: data?.message || response.statusText
      };
    }
    return {
      success: true,
      data,
      error: undefined
    };
  } catch (error: any) {
    return { success: false, data: undefined, error: error?.message || 'Network error' };
  }
}
