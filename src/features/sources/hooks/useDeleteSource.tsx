import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSource } from "../api";
import { sources } from "business-logic";

function useDeleteSource(referenceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSource(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["sources", referenceId],
      });

      // Snapshot the previous value
      const previousSources = queryClient.getQueryData(["sources", referenceId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["sources", referenceId], (old: sources.SourceEntity[] | undefined) => {
        if (old) {
          return old.filter((source) => source.id !== id);
        }

        return [];
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
      queryClient.invalidateQueries({
        queryKey: ["sources", referenceId],
      });
    },
  });
}

export default useDeleteSource;
