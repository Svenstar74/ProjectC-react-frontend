const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function addSource(referenceId: string, url: string, originalText: string, createdBy: string) {
  // Current time in UTC
  const createdAt = new Date().toISOString();

  const response = await fetch(BASE_URL + '/sources', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ referenceId, url, originalText, createdBy, createdAt }),
  });

  if (!response.ok) {
    throw new Error('Could not add source');
  }
}

export default addSource;
