import { distance } from "fastest-levenshtein";

function useClimateConceptSearch() {
  function searchClimateConcepts(query: string, climateConcepts: string[]): string[] {
    const normalizedQuery = query.toLowerCase().replace(/[\[\]']/g, "");;
    const tokenizedQuery = normalizedQuery.split(/[\s_]+/);

    return climateConcepts.filter((name) => {
      const normalizedName = name.toLowerCase().replace(/[\[\]']/g, "");
      const tokenizedName = normalizedName.split(/[_\s]+/);

      return tokenizedQuery.every((queryToken) =>
        tokenizedName.some((token) => fuzzyMatch(token, queryToken))
      );
    });
  }

  function fuzzyMatch(token: string, queryToken: string): boolean {
    // Dynamic calculation of maxDistance based on queryToken length
    let maxDistance: number;
    if (queryToken.length < 6) {
      maxDistance = 1; // Short words have less tolerance
    } else if (queryToken.length < 9) {
      maxDistance = 2; // Medium words have moderate tolerance
    } else {
      maxDistance = 3; // Long words can have more tolerance
    }

    // Check for direct inclusion or if within the dynamically set maxDistance
    if (
      token.includes(queryToken) ||
      distance(token, queryToken) <= maxDistance
    ) {
      return true;
    }

    return false;
  }

  return { searchClimateConcepts };
}

export default useClimateConceptSearch;
