import {
	faBan,
	faPencil,
	faTrash,
	faUserMinus,
	faUserPlus,
	faThumbtack,
	faCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OptionsProps } from "../../interfaces";
import usePosts from "../../hooks/usePosts";
import { usePostModal } from "../../contexts/PostModalContext";

// TODO - make sure that the "follow/unfollow" options are only available depending on whether the user has followed them or not
// TODO - issue where options modal opens for all posts when you click on one

export default function Options({
	isOwner,
	username,
	postID,
	isGalleryPost = false,
	updateOptionsView,
	isPinned
}: OptionsProps) {
	const { deleteMutation, postDataByID, close, pinPost } = usePosts(
		undefined,
		postID
	);
	const { setPostContent, setIsEditMode } = usePostModal();

	return (
		<>
			<div
				className={`bg-black z-10 font-bold border border-zinc-700 py-3 px-1 h-auto absolute right-0 ${
					isGalleryPost ? "w-1/4" : "w-2/5"
				} mr-5 mt-2 rounded-md text-sm shadow-[0_0_10px_rgba(255,255,255,0.4)]`}
			>
				<div
					className="absolute top-0 right-0 m-3 font-bold text-xl hover:cursor-pointer"
					onClick={e => {
						e.stopPropagation();
						e.preventDefault();
						updateOptionsView();
					}}
				>
					<FontAwesomeIcon icon={faCircleXmark} />
				</div>
				<div>
					{isOwner && (
						<p
							className="mb-4 hover:cursor-pointer text-red-600"
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
								deleteMutation(postID);
								close();
							}}
						>
							<span className="mx-3">
								<FontAwesomeIcon icon={faTrash} />
							</span>
							Delete
						</p>
					)}
					{isOwner && (
						<p
							className="my-4 hover:cursor-pointer"
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
								setPostContent(postDataByID?.text);
								setIsEditMode(true);
								updateOptionsView();
							}}
						>
							<span className="mx-3">
								<FontAwesomeIcon icon={faPencil} />
							</span>
							Edit Post
						</p>
					)}
					{isOwner && (
						<p
							className="hover:cursor-pointer"
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
								pinPost(postID);
							}}
						>
							<span className="mx-3">
								<FontAwesomeIcon icon={faThumbtack} />
							</span>
							{isPinned ? "Unpin from profile" : "Pin to profile"}
						</p>
					)}
					{!isOwner && (
						<p
							className="mb-4"
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
							}}
						>
							<span className="mx-3">
								<FontAwesomeIcon icon={faUserPlus} />
							</span>
							Follow @{username}
						</p>
					)}
					{!isOwner && (
						<p
							className="mb-4"
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
							}}
						>
							<span className="mx-3">
								<FontAwesomeIcon icon={faUserMinus} />
							</span>
							Unfollow @{username}
						</p>
					)}
					{!isOwner && (
						<p
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
							}}
						>
							<span className="mx-3">
								<FontAwesomeIcon icon={faBan} />
							</span>
							Block @{username}
						</p>
					)}
				</div>
			</div>
		</>
	);
}
