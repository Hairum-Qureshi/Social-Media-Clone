import { faEllipsis, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Options from "../../../post/Options";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons/faRetweet";
import { faBookmark } from "@fortawesome/free-regular-svg-icons/faBookmark";
import Carousel from "./carousel/Carousel";
import { PostProps } from "../../../../interfaces";

export default function Post({ isOwner, postData }: PostProps) {
	const [showOptions, setShowOptions] = useState(false);

	function close() {
		setShowOptions(false);
	}

	// TODO - create a way so that for each Post component, only one can have the options open and any others close
	// TODO - make sure to replace the hard-coded 'false' for the 'allowDelete' prop being passed into Carousel component
	// TODO - replace hardcoded '7hr'
	// TODO - need to add 'numReposts', 'numSaves' (to the Post database schema), and consider adding a number of shares too to be displayed

	return (
		<div className="w-full p-2 border-t-2 border-b-2 border-t-gray-700 border-b-gray-700 relative">
			{showOptions && <Options close={close} isOwner={isOwner} username = {postData.user.username} />}
			<div className="flex">
				<img
					src={postData.user.profilePicture}
					alt="User pfp"
					className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
				/>
				<div className="lg:flex lg:flex-col lg:w-full">
					<span className="text-base font-bold flex items-center ml-3">
						{postData.user.fullName}&nbsp;
						<span className="text-gray-500 font-light">@{postData.user.username} · 7hr</span>
					</span>
					{postData.text && <span className="ml-3">{postData.text}</span>}
					<div>
						{postData.postImages?.length > 0 && (
							<div className="w-full flex">
								<Carousel
									images={postData.postImages}
									numImages={postData.postImages.length}
									allowDelete={isOwner}
								/>
							</div>
						)}
					</div>
				</div>
				<div
					className="mr-3 hover:cursor-pointer"
					onClick={() => setShowOptions(!showOptions)}
				>
					<FontAwesomeIcon icon={faEllipsis} />
				</div>
			</div>
			<div className="grid grid-cols-5 gap-1 text-center text-gray-600 mt-3">
				<div className="hover:cursor-pointer hover:text-sky-400">
					<FontAwesomeIcon icon={faComment} />
					<span className="ml-1">{postData.numComments}</span>
				</div>
				<div className="hover:cursor-pointer hover:text-green-400">
					<FontAwesomeIcon icon={faRetweet} />
					<span className="ml-1">0</span>
				</div>
				<div className="hover:cursor-pointer hover:text-red-500">
					<FontAwesomeIcon icon={faHeart} />
					<span className="ml-1">{postData.numLikes}</span>
				</div>
				<div className="hover:cursor-pointer hover:text-yellow-400">
					<FontAwesomeIcon icon={faBookmark} />
					<span className="ml-1">0</span>
				</div>
				<div className="hover:cursor-pointer hover:text-sky-400">
					<FontAwesomeIcon icon={faShare} />
				</div>
			</div>
		</div>
	);
}
