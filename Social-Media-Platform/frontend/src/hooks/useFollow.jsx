import { toast } from 'react-hot-toast'; // Importing toast to display error messages
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importing React Query hooks

const useFollow = () => {
  const queryClient = useQueryClient(); // Accessing the query client for cache management
  const { mutate: follow, isPending } = useMutation({
    // Mutation hook to handle following a user
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST", // Sending a POST request to follow a user
        });
        const data = await res.json(); // Parsing the response JSON
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong"); // Throw error if response is not ok
        }
        return data; // Returning data if successful
      } catch (error) {
        throw new Error(error.message); // Throw error message if something goes wrong
      }
    },
    onSuccess: () => {
      // On successful follow, invalidate the queries to refetch data
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }), // Invalidate suggested users list
        queryClient.invalidateQueries({ queryKey: ["authUser"] }) // Invalidate the authenticated user data
      ]);
    },
    onError: (error) => {
      // Display error toast if the mutation fails
      toast.error(error.message);
    },
  });

  return { follow, isPending }; // Returning the follow function and loading state
};

export default useFollow; // Exporting the custom hook
