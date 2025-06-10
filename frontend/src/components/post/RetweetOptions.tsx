import { faPencil, faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import PostModal from "./PostModal";
import Editor from "../pages/feed/editor-tools/Editor";
import { RetweetOptionsProps } from "../../interfaces";

export default function RetweetOptions({
	retweetPostData
}: RetweetOptionsProps) {
	// TODO - add logic to change to "undo repost" if the post has already been reposted
	const [showPostModal, setShowPostModal] = useState(false);
	const [postContent, setPostContent] = useState("");

	return (
		<>
			{showPostModal && (
				<div
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
						setShowPostModal(false);
					}}
					className="fixed inset-0 z-20 flex items-center justify-center bg-black/50"
				>
					<div>
						<PostModal editMode={false}>
							<Editor
								showBorder={false}
								placeHolder="Add a comment"
								buttonText="POST"
								content={postContent}
								isForRetweet={true}
								retweetPostData={retweetPostData}
							/>
						</PostModal>
					</div>
				</div>
			)}
			<div className="bg-black z-10 font-bold border border-zinc-700 py-3 px-2 h-auto absolute -bottom-5 rounded-md text-sm text-white shadow-[0_0_10px_rgba(255,255,255,0.4)]">
				<div className="flex flex-col">
					<div
						onClick={e => {
							e.preventDefault();
							e.stopPropagation();
						}}
						className="flex items-center hover:cursor-pointer"
					>
						<FontAwesomeIcon icon={faRetweet} />
						<span className="ml-3">Repost</span>
					</div>
					<div
						className="flex items-center mt-3 hover:cursor-pointer"
						onClick={e => {
							e.preventDefault();
							e.stopPropagation();
							setShowPostModal(true);
						}}
					>
						<FontAwesomeIcon icon={faPencil} />
						<span className="ml-3">Quote</span>
					</div>
				</div>
			</div>{" "}
			s
		</>
	);
}
