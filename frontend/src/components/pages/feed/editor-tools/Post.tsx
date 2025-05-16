import {
	faCertificate,
	faEllipsis,
	faShare,
	faComment,
	faHeart,
	faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons/faRetweet";
import { useState } from "react";
import Options from "../../../post/Options";
import Carousel from "./carousel/Carousel";
import { PostProps } from "../../../../interfaces";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

export default function Post({ isOwner, postData }: PostProps) {
	const [showOptions, setShowOptions] = useState(false);
	const navigate = useNavigate();

	function close() {
		setShowOptions(false);
	}

	return (
		<div
			className="w-full p-2 border-t-2 border-b-2 border-t-gray-700 border-b-gray-700 relative hover:cursor-pointer"
			onClick={() => navigate(`/post/${postData._id}`)}
		>
			{showOptions && (
				<Options
					close={close}
					isOwner={isOwner}
					username={postData.user.username}
					postID={postData._id}
				/>
			)}
			<div className="flex items-start">
				<img
					src={postData.user.profilePicture}
					alt="User pfp"
					className="w-12 h-12 lg:w-10 lg:h-10 rounded-full object-cover"
					onClick={e => {
						e.stopPropagation();
						navigate(`/${postData.user.username}`);
					}}
				/>
				<div className="flex flex-col ml-3 w-full">
					<Link
						to={`/${postData.user.username}`}
						onClick={e => e.stopPropagation()}
						className="flex items-center text-base font-bold"
					>
						{postData.user.fullName}&nbsp;
						<span className="text-gray-500 font-light">
							@{postData.user.username}
							{postData.user.isVerified && (
								<span
									className="text-purple-500"
									title="This is a verified account"
								>
									<FontAwesomeIcon icon={faCertificate} />
								</span>
							)}
							&nbsp;·&nbsp;{moment(postData.createdAt.toString()).fromNow()}
						</span>
					</Link>
					{postData.text && (
						<div className="mt-1">
							<span>{postData.text}</span>
						</div>
					)}
					{postData.postImages?.length > 0 && (
						<div className="w-full flex mt-2">
							<Carousel
								images={postData.postImages}
								numImages={postData.postImages.length}
								allowDelete={isOwner}
								forPost={true}
							/>
						</div>
					)}
				</div>
				<div
					className="ml-auto mr-3 hover:cursor-pointer"
					onClick={e => {
						e.stopPropagation();
						e.stopPropagation();
						setShowOptions(!showOptions);
					}}
				>
					<FontAwesomeIcon icon={faEllipsis} />
				</div>
			</div>
			<div
				className="grid grid-cols-5 gap-1 text-center text-gray-600 mt-3"
				onClick={e => e.stopPropagation()}
			>
				<div className="hover:text-sky-400">
					<FontAwesomeIcon icon={faComment} />
					<span className="ml-1">{postData.numComments}</span>
				</div>
				<div className="hover:text-green-400">
					<FontAwesomeIcon icon={faRetweet} />
					<span className="ml-1">0</span>
				</div>
				<div className="hover:text-red-500">
					<FontAwesomeIcon icon={faHeart} />
					<span className="ml-1">{postData.numLikes}</span>
				</div>
				<div className="hover:text-yellow-400">
					<FontAwesomeIcon icon={faBookmark} />
					<span className="ml-1">0</span>
				</div>
				<div className="hover:text-sky-400">
					<FontAwesomeIcon icon={faShare} />
				</div>
			</div>
		</div>
	);
}
