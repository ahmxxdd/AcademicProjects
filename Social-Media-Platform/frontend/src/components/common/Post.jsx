import { FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa"; // Importing icons
import { useState } from "react"; // State management hook for comment
import { Link } from "react-router-dom"; // For navigation links
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // For handling data fetching, mutation, and caching
import { toast } from "react-hot-toast"; // Toasts for success and error notifications
import LoadingSpinner from "./LoadingSpinner"; // Loading spinner component
import { formatPostDate } from "../../utils/date"; // Utility function to format post creation date

const Post = ({ post }) => {
  const [comment, setComment] = useState(""); // State for storing the comment text

  // Fetching authenticated user data from the query cache
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient(); // Query client instance for data caching

  const postOwner = post.user; // Post's owner (user who created the post)
  const isLiked = post.likes.includes(authUser._id); // Check if the post is liked by the current user
  const isMyPost = authUser._id === post.user._id; // Check if the current user is the post owner

  const formattedDate = formatPostDate(post.createdAt); // Format the post's creation date

  // Mutation to delete the post
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE", // DELETE request to delete the post
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully"); // Show success message
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate posts query to refetch updated posts
    },
  });

  // Mutation to like the post
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST", // POST request to like the post
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // Update the local cache of posts after a successful like
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes }; // Update the likes array for the specific post
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message); // Show error message if mutation fails
    },
  });

  // Mutation to add a comment on the post
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST", // POST request to add a comment
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }), // Sending the comment text as JSON
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully"); // Show success message
      setComment(""); // Clear the comment input field
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate posts query to refetch the updated posts
    },
    onError: (error) => {
      toast.error(error.message); // Show error message if mutation fails
    },
  });

  // Handlers for actions on the post
  const handleDeletePost = () => {
    deletePost(); // Call delete mutation
  };

  const handlePostComment = (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (isCommenting) return; // Prevent submitting comment if mutation is still pending
    commentPost(); // Call comment mutation
  };

  const handleLikePost = () => {
    if (isLiking) return; // Prevent liking if mutation is still pending
    likePost(); // Call like mutation
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        {/* Post Owner Avatar */}
        <div className="avatar">
          <Link to={`/profile/${postOwner.username}`} className="w-8 rounded-full overflow-hidden">
            <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            {/* Post owner and post details */}
            <Link to={`/profile/${postOwner.username}`} className="font-bold">{postOwner.fullName}</Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {/* If it's the user's post, show delete button */}
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />
                )}
                {isDeleting && <LoadingSpinner size="sm" />} {/* Show loading spinner while deleting */}
              </span>
            )}
          </div>
          {/* Post content */}
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {/* Display image/video attached to the post */}
            {post.img && (post.img.endsWith(".mp4") ? (
              <video controls width="500">
                <source src={post.img} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={post.img} alt="Post media" style={{ maxWidth: "100%" }} />
            ))}
          </div>
          {/* Post interactions (like, comment, etc.) */}
          <div className="flex mt-3">
            <div className="flex gap-4 items-center w-2/3">
              {/* Comment button */}
              <div className="flex gap-1 items-center cursor-pointer group" onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }>
                <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">{post.comments.length}</span>
              </div>

              {/* Comments Modal */}
              <dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">No comments yet 🤔 Be the first one 😉</p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img src={comment.user.profileImg || "/avatar-placeholder.png"} />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{comment.user.fullName}</span>
                            <span className="text-gray-700 text-sm">@{comment.user.username}</span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Comment input */}
                  <form className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2" onSubmit={handlePostComment}>
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>

              {/* Like button */}
              <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )}
                <span className={`text-sm group-hover:text-pink-500 ${isLiked ? "text-pink-500" : "text-slate-500"}`}>
                  {post.likes.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
