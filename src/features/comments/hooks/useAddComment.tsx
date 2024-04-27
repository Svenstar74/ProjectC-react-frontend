import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comments } from 'business-logic';

import { addComment } from '../api';

/**
 * Custom React hook that adds a comment to the database using optimistic updates
 * @param referenceId The id of the node / connection the comment belongs to
 * @returns React Query mutation object
 */
function useAddComment(referenceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: { referenceId: string; text: string; createdBy: string }) =>
      addComment(newComment.referenceId, newComment.text, newComment.createdBy),
    onMutate: async (newComment: comments.CommentEntity) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['comments', referenceId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['comments', referenceId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['comments', referenceId], (old: comments.CommentEntity[] | undefined) => {
        if (old) {
          return [{id: Math.random().toString().slice(2), ...newComment}, ...old];
        }
        return [newComment];
      });

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', referenceId], context.previousComments);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', referenceId] });
    },
  });
}

export default useAddComment;
