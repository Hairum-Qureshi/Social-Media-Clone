import { useState } from "react";
import Editor from "./editor-tools/Editor";
import Post from "./editor-tools/Post";
import useAuthContext from "../../../contexts/AuthContext";
import usePosts from "../../../hooks/usePosts";
import { Post as IPost } from "../../../interfaces";
import { Link } from "react-router-dom";

export default function Landing() {
	const [isForYou, setIsForYou] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);
	const { userData } = useAuthContext()!;

	const { postData, loadingStatus } = usePosts(
		isForYou ? "For You" : isFollowing ? "Following" : ""
	);

	// TODO - for the navigation bar, make sure to add a blue dot to symbolize notifications
	// TODO - add feature where if you're in that route, the icon should be filled in, otherwise it shouldn't
	// TODO - make sure it's mobile friendly for ALL screen sizes!
	// TODO - prevent the user from being redirected if they hit the like, comment, settings, etc. buttons on the post
	// TODO - add the '/post/post id' route
	// TODO - style the 'loading...' text
	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto">
			<div className="bg-black h-screen">
				<div className="border-b-2 border-gray-500 h-14 flex text-center hover:cursor-pointer font-bold w-full">
					<div
						className={`w-1/2 flex items-center justify-center hover:bg-gray-900 ${
							isForYou && "border-b-2 border-sky-500"
						}`}
						onClick={() => {
							setIsForYou(true);
							setIsFollowing(false);
						}}
					>
						For You
					</div>
					<div
						className={`w-1/2 flex items-center justify-center hover:bg-gray-900 ${
							isFollowing && "border-b-2 border-sky-500"
						}`}
						onClick={() => {
							setIsForYou(false);
							setIsFollowing(true);
						}}
					>
						Following
					</div>
				</div>
				<div>
					<Editor />
				</div>
				{loadingStatus
					? "Loading..."
					: postData.map((post: IPost) => {
							return (
								<Link to={`/post/${post._id}`}>
									<Post
										isOwner={post.user._id === userData?._id}
										postData={post}
									/>
								</Link>
							);
					  })}
			</div>
		</div>
	);
}
