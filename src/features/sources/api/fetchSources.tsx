import { sources } from "business-logic";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchSources(referenceId: string): Promise<sources.SourceEntity[]> {
  const response = await fetch(BASE_URL + '/sources/reference/' + referenceId);

  if (!response.ok) {
    throw new Error('Could not fetch sources');
  }

  const data = await response.json();

  return data.data;
}

export default fetchSources;
