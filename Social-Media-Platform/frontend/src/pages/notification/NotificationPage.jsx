import { Link } from "react-router-dom"; // Import Link for navigation
import LoadingSpinner from "../../components/common/LoadingSpinner"; // Import LoadingSpinner component for loading state

import { IoSettingsOutline } from "react-icons/io5"; // Import Settings icon
import { FaUser } from "react-icons/fa"; // Import User icon (for follow notifications)
import { FaHeart } from "react-icons/fa6"; // Import Heart icon (for like notifications)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import hooks for handling data fetching and mutations
import { toast } from 'react-hot-toast'; // Import toast for displaying notifications

const NotificationPage = () => {
  const queryClient = useQueryClient(); // Initialize React Query client for caching and invalidating queries

  // Fetch notifications using React Query's useQuery hook
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"], // Key used for caching the query
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications"); // Fetch notifications from the API
        const data = await res.json(); // Parse the response JSON

        if (!res.ok) { // If the response is not OK, throw an error
          throw new Error(data.error || "Something went wrong");
        }
        return data; // Return the data if successful
      } catch (error) { // Catch and throw any errors encountered
        throw new Error(error);
      }
    }
  });

  // Mutation for deleting notifications
  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "DELETE", // Sending DELETE request to the server to remove notifications
        });
        const data = await res.json(); // Parse the response JSON

        if (!res.ok) { // If the response is not OK, throw an error
          throw new Error(data.error || "Something went wrong");
        }
        return data; // Return data if successful
      } catch (error) { // Catch and throw any errors encountered
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully"); // Show success toast
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); // Invalidate the notifications cache to refresh data
    },
    onError: (error) => {
      toast.error(error.message); // Show error toast if something goes wrong
    }
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        {/* Header Section with Notifications Title and Settings Dropdown */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p> {/* Title */}
          <div className="dropdown">
            {/* Settings Dropdown */}
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" /> {/* Settings icon */}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {/* Option to delete all notifications */}
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Show loading spinner while data is being fetched */}
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* If no notifications are available */}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}

        {/* Map over notifications and display them */}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {/* Show appropriate icon based on notification type */}
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" /> // Follow icon
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" /> // Like icon
              )}

              {/* Link to the user's profile */}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    {/* Display user profile image */}
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png" // Fallback image if no profile image is provided
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username} {/* Display username */}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you" // Show follow message
                    : "liked your post"} {/* Show like message */}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationPage;
