import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faShare,
	faComment,
	faHeart,
	faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons/faRetweet";
import { IconsProps } from "../../interfaces";
import usePosts from "../../hooks/usePosts";

export default function PostIconsBar({ postData }: IconsProps) {
	const { bookmarkPostMutation, likePostMutation } = usePosts(
		undefined,
		postData?._id
	);

	console.log(postData?.isLiked);

	return (
		<div
			className="grid grid-cols-5 gap-1 text-center text-gray-600 mt-3"
			onClick={e => {
				e.stopPropagation();
				e.preventDefault();
			}}
		>
			<div className="hover:text-sky-400 hover:cursor-pointer">
				<FontAwesomeIcon icon={faComment} />
				<span className="ml-1">{postData?.numComments || 0}</span>
			</div>
			<div className="hover:text-green-400 hover:cursor-pointer">
				<FontAwesomeIcon icon={faRetweet} />
				<span className="ml-1">{postData?.numRetweets || 0}</span>
			</div>
			{postData?.isLiked ? (
				<div
					className="hover:text-red-500 text-red-500 hover:cursor-pointer"
					onClick={() => likePostMutation(postData?._id)}
				>
					<FontAwesomeIcon icon={faHeart} />
					<span className="ml-1">{postData?.numLikes || 0}</span>
				</div>
			) : (
				<div
					className="hover:text-red-500 hover:cursor-pointer"
					onClick={() => likePostMutation(postData?._id)}
				>
					<FontAwesomeIcon icon={faHeart} />
					<span className="ml-1">{postData?.numLikes || 0}</span>
				</div>
			)}
			{postData?.isBookmarked ? (
				<div
					className="hover:text-yellow-400 text-yellow-400 hover:cursor-pointer"
					onClick={() => bookmarkPostMutation(postData?._id)}
				>
					<FontAwesomeIcon icon={faBookmark} />
					<span className="ml-1">{postData?.numBookmarks || 0}</span>
				</div>
			) : (
				<div
					className="hover:text-yellow-400 hover:cursor-pointer"
					onClick={() => bookmarkPostMutation(postData?._id)}
				>
					<FontAwesomeIcon icon={faBookmark} />
					<span className="ml-1">{postData?.numBookmarks || 0}</span>
				</div>
			)}
			<div
				className="hover:text-sky-400 hover:cursor-pointer"
				onClick={async () => {
					alert("Copied to clipboard");
					await navigator.clipboard.writeText(
						`${import.meta.env.VITE_BACKEND_BASE_URL}/post/${postData?._id}`
					);
				}}
			>
				<FontAwesomeIcon icon={faShare} />
			</div>
		</div>
	);
}
