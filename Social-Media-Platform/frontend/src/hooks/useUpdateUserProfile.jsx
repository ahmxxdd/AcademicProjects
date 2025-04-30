import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing React Query hooks for mutation and query client management
import toast from "react-hot-toast"; // Importing toast to display notifications

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient(); // Accessing the query client to manage cache

  // useMutation hook to handle profile update mutation
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    // The mutation function that will update the user profile
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/users/update`, {
          method: "POST", // Sending POST request to update the user profile
          headers: {
            "Content-Type": "application/json", // Setting the request header to handle JSON
          },
          body: JSON.stringify(formData), // Sending the updated form data as JSON in the request body
        });
        const data = await res.json(); // Parsing the response JSON

        // If the response is not OK, throw an error with the error message
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        // Throw error in case of failure
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // On successful profile update, show a success toast and invalidate related queries
      toast.success("Profile updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }), // Invalidate the cached authUser data
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }), // Invalidate the cached userProfile data
      ]);
    },
    onError: (error) => {
      // Show error toast if the mutation fails
      toast.error(error.message);
    },
  });

  // Returning the updateProfile function to trigger the update and isUpdatingProfile to indicate the loading state
  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile; // Exporting the custom hook
