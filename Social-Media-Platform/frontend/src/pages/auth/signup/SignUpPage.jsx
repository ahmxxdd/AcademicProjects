import { Link } from "react-router-dom"; // Importing Link component for routing
import { useState } from "react"; // useState hook to manage form data
import { MdOutlineMail } from "react-icons/md"; // Importing icon for email field
import { FaUser } from "react-icons/fa"; // Importing icon for username field
import { MdPassword } from "react-icons/md"; // Importing icon for password field
import { MdDriveFileRenameOutline } from "react-icons/md"; // Importing icon for full name field
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing hooks from React Query
import toast from "react-hot-toast"; // Importing toast notifications

const SignUpPage = () => {
  // Initializing state to manage form input data
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  // Initializing queryClient to interact with React Query cache
  const queryClient = useQueryClient();

  // Defining the mutation for user signup
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        // Making a POST request to the backend API for signup
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to create account");
        }

        console.log(data); // Log the response data for debugging
        return data;
      } catch (error) {
        console.error(error); // Handle any errors during the request
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully"); // Show success toast on successful account creation
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidate queries related to user authentication
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    mutate(formData); // Trigger the signup mutation with the form data
  };

  // Handle input field changes and update state
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      {/* Left side: logo image on large screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src="/am-music-logo-removebg-preview.png" width="500" alt="Logo" />
      </div>
      {/* Right side: sign-up form */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white">Sign Up</h1>

          {/* Email input field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          {/* Username and Full Name input fields (flex layout for small screens) */}
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>

          {/* Password input field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          {/* Sign up button, shows loading text when pending */}
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Sign Up"}
          </button>

          {/* Show error message if the mutation fails */}
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>

        {/* Sign-in link if user already has an account */}
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
