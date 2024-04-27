import { useQuery } from '@tanstack/react-query';
import { fetchComments } from '../api';

function useFetchComments(referenceId: string) {
  return useQuery({
    queryKey: ['comments', referenceId],
    queryFn: () => fetchComments(referenceId),
    enabled: !!referenceId,
  });
}

export default useFetchComments;
