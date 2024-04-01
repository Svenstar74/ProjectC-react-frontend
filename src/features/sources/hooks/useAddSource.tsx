import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSource } from "../api";
import { sources } from "business-logic";

/**
 * Custom React hook that adds a source to the database using optimistic updates
 * @param referenceId The id of the node / connection the source belongs to
 * @returns React Query mutation object
 */
function useAddSource(referenceId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSource: { referenceId: string; url: string; originalText: string; createdBy: string; }) =>
      addSource(newSource.referenceId, newSource.url, newSource.originalText, newSource.createdBy),
    onMutate: async (newSource) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["sources", referenceId] });

      // Snapshot the previous value
      const previousSources = queryClient.getQueryData(["sources", referenceId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["sources", referenceId], (old: sources.SourceEntity[] | undefined) => {
        if (old) {
          return [{ id: Math.random().toString().slice(2), ...newSource }, ...old];
        }
        return [newSource];
      });

      // Return a context object with the snapshotted value
      return { previousSources };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context) => {
      if (context?.previousSources) {
        queryClient.setQueryData(["sources", referenceId], context.previousSources);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sources", referenceId] });
    },
  });
}

export default useAddSource;
