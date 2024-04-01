const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function deleteSource(id: string) {
  const response = await fetch(BASE_URL + `/sources/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Could not delete source');
  }
}

export default deleteSource;
