import Post from "./Post"; // Importing the Post component to render each post
import PostSkeleton from "../skeletons/PostSkeleton"; // Importing the skeleton loader for posts
import { useQuery } from "@tanstack/react-query"; // Importing useQuery hook from react-query to handle data fetching
import { useEffect } from "react"; // Importing useEffect for side effects in function components

const Posts = ({ feedType, username, userId }) => {
  // Function to determine the API endpoint based on the feedType (e.g., all posts, following posts, user posts, or liked posts)
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all"; // Endpoint for all posts
      case "following":
        return "/api/posts/following"; // Endpoint for posts from users the current user is following
      case "posts":
        return `/api/posts/user/${username}`; // Endpoint for posts by a specific user
      case "likes":
        return `/api/posts/likes/${userId}`; // Endpoint for posts liked by a specific user
      default:
        return "/api/posts/all"; // Default to all posts if no feedType is matched
    }
  };

  const POST_ENDPOINT = getPostEndpoint(); // Set the endpoint based on the feedType prop

  // Using useQuery hook to fetch data from the determined endpoint
  const {
    data: posts, // The posts data from the API response
    isLoading, // Loading state
    refetch, // Function to trigger a manual refetch
    isRefetching, // State indicating if a refetch is in progress
  } = useQuery({
    queryKey: ["posts"], // Unique query key for caching the query
    queryFn: async () => { // Fetch function
      try {
        const res = await fetch(POST_ENDPOINT); // Make API request
        const data = await res.json(); // Parse response as JSON

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong"); // Handle error if the request fails
        }

        console.log(data); // Log the fetched data for debugging
        return data; // Return data to be used by the query
      } catch (error) {
        throw new Error(error); // Catch and throw any errors that occur during fetching
      }
    },
  });

  // useEffect hook to trigger a refetch whenever feedType or username changes
  useEffect(() => {
    refetch(); // Manually refetch posts
  }, [feedType, refetch, username]);

  return (
    <>
      {/* If the data is still loading or being refetched, show skeleton loaders */}
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton /> {/* Skeleton loader for a post */}
          <PostSkeleton /> {/* Skeleton loader for a post */}
          <PostSkeleton /> {/* Skeleton loader for a post */}
        </div>
      )}

      {/* If no posts are available, show a message */}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p> // No posts available message
      )}

      {/* Render posts when available */}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} /> // Render each post using the Post component
          ))}
        </div>
      )}
    </>
  );
};

export default Posts; // Export the Posts component
