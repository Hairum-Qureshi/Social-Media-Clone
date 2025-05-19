import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faShare,
	faComment,
	faHeart,
	faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons/faRetweet";
import { IconsProps } from "../../interfaces";

export default function PostIconsBar({postData}:IconsProps) {
	return (
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
	);
}
