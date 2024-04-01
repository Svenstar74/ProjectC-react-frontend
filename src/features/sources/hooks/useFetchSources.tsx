import { useQuery } from "@tanstack/react-query";
import { fetchSources } from "../api";

function useFetchSources(referenceId: string) {
  return useQuery({
    queryKey: ["sources", referenceId],
    queryFn: () => fetchSources(referenceId),
    enabled: !!referenceId,
  });
}

export default useFetchSources;
