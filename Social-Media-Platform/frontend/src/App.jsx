import { Routes, Route, Navigate } from "react-router-dom"; // Import necessary components for routing
import Sidebar from "./components/common/Sidebar"; // Import the Sidebar component
import RightPanel from "./components/common/RightPanel"; // Import the RightPanel component
import HomePage from "./pages/home/HomePage"; // Import the HomePage component
import LoginPage from "./pages/auth/login/LoginPage"; // Import the LoginPage component
import SignUpPage from "./pages/auth/signup/SignUpPage"; // Import the SignUpPage component
import NotificationPage from "./pages/notification/NotificationPage"; // Import the NotificationPage component
import ProfilePage from "./pages/profile/ProfilePage"; // Import the ProfilePage component
import { Toaster } from "react-hot-toast"; // Import Toaster for displaying notifications
import { useQuery } from "@tanstack/react-query"; // Import the useQuery hook for fetching data
import LoadingSpinner from "./components/common/LoadingSpinner"; // Import the LoadingSpinner component

function App() {
  // Fetch authenticated user data using react-query
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'], // The key for caching the query
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me"); // Make an API call to get the current authenticated user
        const data = await res.json(); // Parse the response JSON

        // If there's an error in the response, return null
        if (data.error) {
          return null;
        }

        // If the response is not OK, throw an error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        console.log("auth user is here:", data); // Log the authenticated user data
        return data; // Return the user data
      } catch (error) {
        throw new Error(error); // If there's an error, throw it
      }
    },
    retry: false, // Disable automatic retries on failure
  });

  // Show a loading spinner while fetching the authenticated user data
  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' /> {/* Display the loading spinner */}
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />} {/* Show Sidebar if user is authenticated */}

      <Routes>
        {/* Define the routes with conditional rendering based on authentication */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      {authUser && <RightPanel />} {/* Show RightPanel if user is authenticated */}
      
      <Toaster /> {/* Display toaster notifications */}
    </div>
  );
}

export default App;
