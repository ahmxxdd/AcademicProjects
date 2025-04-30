import { CiImageOn } from "react-icons/ci"; // Importing the image icon for the image upload button
import { useRef, useState } from "react"; // Importing hooks for managing state and references
import { IoCloseSharp } from "react-icons/io5"; // Importing the close icon for removing the image preview
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Importing hooks from React Query for mutation and querying
import { toast } from 'react-hot-toast'; // Importing toast for showing notifications

const CreatePost = () => {
  // State for managing the text of the post and image preview
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  
  // Ref to access the hidden file input for image upload
  const imgRef = useRef(null);

  // Query to get the authenticated user's data
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // QueryClient instance to invalidate queries when post is created
  const queryClient = useQueryClient();

  // Mutation for creating a post
  const { mutate: createPost, isPending, isError, error } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        // Send the data to the server to create a new post
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();

        // If the response is not OK, throw an error
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        // Handle any error that occurs during the request
        throw new Error(error);
      }
    },
    // On success, reset form data and show success toast
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate posts query to refresh the posts
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form behavior
    createPost({ text, img }); // Call the mutation to create the post
  };

  // Handle image selection
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result); // Set the image data for preview
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      {/* Post form */}
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)} // Update text state when typing
        />
        
        {/* Display the image preview if there is an image */}
        {img && (
          <div className="relative w-72 mx-auto">
            {/* Close button to remove the image */}
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null); // Reset image state
                imgRef.current.value = null; // Clear the file input
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        {/* Bottom row with image button and post button */}
        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            {/* Image upload button */}
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()} // Trigger file input click
            />
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange} // Trigger when user selects a file
          />
          {/* Post button */}
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"} {/* Show loading text if posting */}
          </button>
        </div>
        {/* Display error message if there's an error */}
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
