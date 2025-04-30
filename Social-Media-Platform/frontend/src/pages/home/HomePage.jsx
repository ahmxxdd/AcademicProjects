import { useState } from "react"; // Importing the useState hook to manage state

import Posts from "../../components/common/Posts"; // Importing the Posts component to display the feed
import CreatePost from "./CreatePost"; // Importing the CreatePost component to create new posts

const HomePage = () => {
	// State for managing the type of feed (either "forYou" or "following")
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			{/* Main container for the page, takes up 4/4 of the available space */}
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header section with two options (For you and Following) */}
				<div className='flex w-full border-b border-gray-700'>
					{/* "For you" tab */}
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						// On click, set feedType to "forYou"
						onClick={() => setFeedType("forYou")}
					>
						For you
						{/* If the feedType is "forYou", show a line under this tab */}
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
					
					{/* "Following" tab */}
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						// On click, set feedType to "following"
						onClick={() => setFeedType("following")}
					>
						Following
						{/* If the feedType is "following", show a line under this tab */}
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/* CREATE POST INPUT */}
				{/* CreatePost component allows the user to create new posts */}
				<CreatePost />

				{/* POSTS */}
				{/* Pass the current feedType to the Posts component to display the correct feed */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};

export default HomePage;
