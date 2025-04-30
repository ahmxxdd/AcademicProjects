import { useState } from "react"; // Importing React's useState hook to manage local state
import { Link } from "react-router-dom"; // Importing Link for navigation to other pages
import { MdOutlineMail } from "react-icons/md"; // Importing email icon
import { MdPassword } from "react-icons/md"; // Importing password icon
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing react-query hooks for handling mutations and query invalidation

const LoginPage = () => {
  // Setting up local state for form data (username and password)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Setting up the queryClient for query invalidation after successful login
  const queryClient = useQueryClient();

  // Defining the mutation for the login request
  const {
    mutate: loginMutation, // Function to trigger the login mutation
    isPending, // Boolean flag for checking if the request is pending
    isError, // Boolean flag for checking if an error occurred
    error, // Capturing the error message
  } = useMutation({
    // Mutation function to handle the login request
    mutationFn: async ({ username, password }) => {
      try {
        // Sending the login request to the backend
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }), // Sending the form data as JSON
        });

        // Parsing the response from the server
        const data = await res.json();

        // Checking if the response is successful
        if (!res.ok) {
          throw new Error(data.error || "Failed to login"); // Throw an error if login fails
        }
      } catch (error) {
        throw new Error(error); // Catch and throw the error
      }
    },
    onSuccess: () => {
      // Invalidate the authUser query after successful login to refresh the user data
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  // Handling form submission (login)
  const handleSubmit = (e) => {
    e.preventDefault(); // Preventing default form behavior (page reload)
    loginMutation(formData); // Triggering the login mutation with the form data
  };

  // Handling form input change and updating the state accordingly
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Updating specific field in the form data
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left side image on larger screens */}
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <img src="/am-music-logo-removebg-preview.png" width="500"></img>
      </div>
      {/* Form section for login */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-extrabold text-white">Sign In</h1>

          {/* Username input field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail /> {/* Email icon */}
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username" // The name of the input to update in the formData
              onChange={handleInputChange} // Calling handleInputChange on change
              value={formData.username} // Binding the username value to formData state
            />
          </label>

          {/* Password input field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword /> {/* Password icon */}
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password" // The name of the input to update in the formData
              onChange={handleInputChange} // Calling handleInputChange on change
              value={formData.password} // Binding the password value to formData state
            />
          </label>

          {/* Submit button */}
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Login"} {/* Button text changes based on mutation status */}
          </button>

          {/* Error message if there is an error */}
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>

        {/* Link to signup page */}
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
