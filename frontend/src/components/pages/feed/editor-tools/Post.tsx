import { faEllipsis, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Options from "../../../post/Options";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons/faRetweet";
import { faBookmark } from "@fortawesome/free-regular-svg-icons/faBookmark";
import Carousel from "./carousel/Carousel";

interface Props {
	images?: string[];
	text?: string;
}

export default function Post({ images, text }: Props) {
	const [showOptions, setShowOptions] = useState(false);

	function close() {
		setShowOptions(false);
	}

	// TODO - create a way so that for each Post component, only one can have the options open and any others close

	return (
		<div className="w-full p-2 border-t-2 border-b-2 border-t-gray-700 border-b-gray-700 relative">
			{showOptions && <Options close={close} />}
			<div className="flex">
				<img
					src="https://i.pinimg.com/474x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
					alt="User pfp"
					className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
				/>
				<div className="lg:flex lg:flex-col lg:w-full">
					<span className="text-base font-bold flex items-center ml-3">
						John Doe&nbsp;
						<span className="text-gray-500 font-light">@username · 7hr</span>
					</span>
					{text && <span className="ml-3">{text}</span>}
					<div>
						{images && images.length > 0 && (
							<div className="w-full flex">
								<Carousel
									images={images}
									numImages={images.length}
									allowDelete={false}
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
					<span className="ml-1">0</span>
				</div>
				<div className="hover:cursor-pointer hover:text-green-400">
					<FontAwesomeIcon icon={faRetweet} />
					<span className="ml-1">0</span>
				</div>
				<div className="hover:cursor-pointer hover:text-red-500">
					<FontAwesomeIcon icon={faHeart} />
					<span className="ml-1">0</span>
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
