const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function addComment(referenceId: string, text: string, createdBy: string) {
  // Current time in UTC
  const createdAt = new Date().toISOString();

  const response = await fetch(BASE_URL + '/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ referenceId, text, createdBy, createdAt }),
  });

  if (!response.ok) {
    throw new Error('Could not add comment');
  }
}

export default addComment;
