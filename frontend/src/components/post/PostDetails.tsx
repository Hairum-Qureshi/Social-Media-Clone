import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../../contexts/AuthContext";
import usePosts from "../../hooks/usePosts";
import Post from "../pages/feed/editor-tools/Post";
import {
	faArrowLeft,
	faFaceSmile,
	faFilm,
	faLocationDot,
	faPhotoFilm
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

export default function PostDetails() {
	const { postDataByID } = usePosts();
	const { userData } = useAuthContext()!;
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [showOP, setShowOP] = useState(false);

	const handleInput = () => {
		const textarea = textAreaRef.current;
		if (textarea) {
			textarea.style.height = "auto"; // Reset height to auto to recalculate
			textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight for dynamic resizing
		}
	};

	function show() {
		setShowOP(true);
	}

	return (
		postDataByID && (
			<div className="bg-black text-white w-full overflow-y-auto">
				<div className="flex items-center w-full">
					<Link to="/" className="">
						<span className="text-lg ml-3">
							<FontAwesomeIcon icon={faArrowLeft} />
						</span>
					</Link>
					<span>
						<h3 className="py-4 text-xl mx-5 font-semibold">Post</h3>
					</span>
				</div>
				<Post
					isOwner={postDataByID.user._id === userData?._id}
					postData={postDataByID}
				/>
				<div className="border-b-2 border-b-slate-600 flex p-2">
					<img
						src={userData?.profilePicture}
						alt="User profile picture"
						className="w-10 h-10 rounded-full object-cover mr-3"
					/>
					<div className="flex-1">
						{showOP && (
							<p className="text-slate-500 text-sm">
								Replying to&nbsp;
								<span className="text-sky-500">
									@{postDataByID.user.username}
								</span>
							</p>
						)}
						<textarea
							placeholder="Post your reply"
							className="w-full bg-transparent p-2 resize-none text-white outline-none text-lg max-h-32"
							ref={textAreaRef}
							onInput={handleInput}
							onClick={show}
							data-gramm="false"
							data-gramm_editor="false"
							data-enable-grammarly="false"
						></textarea>
						<div className="text-sky-400 flex justify-between items-center w-full">
							<div className="flex justify-start">
								<span className="mx-2 hover:cursor-pointer mr-5">
									<FontAwesomeIcon icon={faPhotoFilm} /> {/* Photos */}
								</span>
								<span className="mx-2 hover:cursor-pointer mr-5">
									<FontAwesomeIcon icon={faFilm} /> {/* GIF */}
								</span>
								<span className="mx-2 hover:cursor-pointer mr-5">
									<FontAwesomeIcon icon={faFaceSmile} /> {/* EMOJIS */}
								</span>
								<span className="mx-2 hover:cursor-pointer mr-5">
									<FontAwesomeIcon icon={faLocationDot} /> {/* LOCATION */}
								</span>
							</div>
							<div className="flex justify-end">
								<button className="p-1 bg-white text-black font-semibold hover:cursor-pointer rounded-full w-20">
									Post
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
}
