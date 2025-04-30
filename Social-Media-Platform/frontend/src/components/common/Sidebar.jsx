import { MdHomeFilled } from "react-icons/md"; // Importing Home icon
import { IoNotifications } from "react-icons/io5"; // Importing Notifications icon
import { FaUser } from "react-icons/fa"; // Importing User icon
import { Link } from "react-router-dom"; // Importing Link component for navigation
import { BiLogOut } from "react-icons/bi"; // Importing Logout icon
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Importing React Query hooks
import { toast } from "react-hot-toast"; // Importing toast for notifications

const Sidebar = () => {
  const queryClient = useQueryClient(); // Accessing the query client for cache management
  const { mutate: logout } = useMutation({
    // Mutation hook for handling the logout functionality
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST", // Sending POST request to logout
        });
        const data = await res.json(); // Parsing the response JSON

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong"); // Error handling if logout fails
        }
      } catch (error) {
        throw new Error(error); // Throwing error if something went wrong
      }
    },
    onSuccess: () => {
      // On successful logout, invalidate the authUser query to update the user state
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      // Show an error message if logout fails
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] }); // Fetching the authenticated user data

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      {/* Sidebar container with responsive width */}
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          {/* Logo link */}
          <img src="/am-music-logo-removebg-preview.png" alt="AM Music Logo" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          {/* Sidebar menu list */}
          
          <li className="flex justify-center md:justify-start">
            {/* Home link */}
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" /> {/* Home icon */}
              <span className="text-lg hidden md:block">Home</span> {/* Home text */}
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            {/* Notifications link */}
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" /> {/* Notifications icon */}
              <span className="text-lg hidden md:block">Notifications</span> {/* Notifications text */}
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            {/* Profile link */}
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" /> {/* User icon */}
              <span className="text-lg hidden md:block">Profile</span> {/* Profile text */}
            </Link>
          </li>
        </ul>

        {authUser && (
          // Show the following section if the user is logged in
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              {/* Display the user's avatar */}
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="User Avatar" />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                {/* Display user's full name and username */}
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior of the link
                  logout(); // Trigger logout mutation
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar; // Export the Sidebar component
