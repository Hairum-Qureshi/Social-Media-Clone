import {
	faCertificate,
	faEllipsis,
	faThumbtack
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Options from "../../../post/Options";
import Carousel from "./carousel/Carousel";
import { PostProps } from "../../../../interfaces";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import PostIconsBar from "../../../post/PostIconsBar";
import PostModal from "../../../post/PostModal";
import Editor from "./Editor";
import { usePostModal } from "../../../../contexts/PostModalContext";
import { useState } from "react";

export default function Post({
	isOwner,
	postData,
	isPinned = false
}: PostProps) {
	const navigate = useNavigate();
	const { isEditMode, postContent } = usePostModal();

	const [optionsMenu, setOptionsMenu] = useState(false);

	function updateOptionsView() {
		setOptionsMenu(!optionsMenu);
	}

	return (
		<>
			{isEditMode && (
				<PostModal editMode={isEditMode}>
					<Editor
						showBorder={false}
						placeHolder="Edit Post"
						buttonText="CONFIRM"
						content={postContent}
					/>
				</PostModal>
			)}
			<div
				className="w-full p-2 border-t-2 border-b-2 border-t-gray-700 border-b-gray-700 relative hover:cursor-pointer"
				onClick={() => navigate(`/post/${postData._id}`)}
			>
				{isPinned && (
					<span className="text-zinc-500 text-sm">
						<FontAwesomeIcon icon={faThumbtack} />
						&nbsp;Pinned
					</span>
				)}
				{optionsMenu && (
					<Options
						isOwner={isOwner}
						username={postData.user.username}
						postID={postData._id}
						updateOptionsView={updateOptionsView}
					/>
				)}
				<div className="flex items-start mt-3">
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
									images={postData?.postImages}
									numImages={postData?.postImages.length}
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
							e.preventDefault();
							setOptionsMenu(true);
						}}
					>
						<FontAwesomeIcon icon={faEllipsis} />
					</div>
				</div>
				<PostIconsBar postData={postData} />
			</div>
		</>
	);
}
