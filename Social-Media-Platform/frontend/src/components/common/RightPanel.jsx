import { Link } from "react-router-dom"; // Importing Link component for navigation
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton"; // Importing skeleton loader for the right panel
import { useQuery } from "@tanstack/react-query"; // Importing useQuery hook from react-query for data fetching
import useFollow from "../../hooks/useFollow"; // Importing custom hook for follow functionality
import LoadingSpinner from './LoadingSpinner'; // Importing the loading spinner component

const RightPanel = () => {
  // Fetching suggested users using react-query
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"], // Query key to uniquely identify this query
    queryFn: async () => { // Query function to fetch suggested users
      try {
        const res = await fetch("/api/users/suggested"); // Making an API request to get suggested users
        const data = await res.json(); // Parsing the response as JSON
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong"); // Error handling if the response is not ok
        }
        return data; // Returning the data to be used by the query
      } catch (error) {
        throw new Error(error.message); // Catching and throwing any error that occurs
      }
    },
  });

  const { follow, isPending } = useFollow(); // Destructuring the follow function and loading state from the custom hook

  // If no suggested users are available, return an empty div
  if (suggestedUsers?.length === 0) {
    return <div className="md:w-64 w-0"></div>;
  }

  return (
    <div className="hidden lg:block my-4 mx-2">
      {/* The right panel container */}
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p> {/* Title of the section */}
        <div className="flex flex-col gap-4">
          {/* If data is still loading, show skeleton loaders */}
          {isLoading && (
            <>
              <RightPanelSkeleton /> {/* Skeleton loader for the user items */}
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          
          {/* Once data is loaded, display the list of suggested users */}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`} // Navigates to the user's profile page
                className="flex items-center justify-between gap-4"
                key={user._id} // Unique key for each user item
              >
                <div className="flex gap-2 items-center">
                  {/* User's avatar and basic info */}
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"} // Display user's profile image or a placeholder if unavailable
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName} {/* User's full name */}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username} {/* User's username */}
                    </span>
                  </div>
                </div>
                <div>
                  {/* Follow button */}
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default button action
                      follow(user._id); // Call the follow function from the custom hook
                    }}
                  >
                    {/* Show loading spinner if follow action is pending */}
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel; // Exporting the RightPanel component
