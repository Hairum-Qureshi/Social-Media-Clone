import {
	faBan,
	faPencil,
	faTrash,
	faUserMinus,
	faUserPlus,
	faX
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OptionsProps } from "../../interfaces";
import usePosts from "../../hooks/usePosts";

// TODO - make sure that the "follow/unfollow" options are only available depending on whether the user has followed them or not
export default function Options({
	close,
	isOwner,
	username,
	postID,
	isGalleryPost = false,
	setEditMode
}: OptionsProps) {
	const { deleteMutation, postDataByID } = usePosts(undefined, postID);

	return (
		<>
			<div
				className={`bg-black z-10 border-2 font-bold border-white p-2 h-auto absolute right-0 ${
					isGalleryPost ? "w-1/4" : "w-2/5"
				} mr-5 mt-2 rounded-md`}
			>
				<div
					className="absolute top-0 right-0 m-3 font-bold text-lg hover:cursor-pointer"
					onClick={e => {
						e.stopPropagation();
						e.preventDefault();
						close();
					}}
				>
					<FontAwesomeIcon icon={faX} />
				</div>
				<div>
					{isOwner && (
						<p
							className="my-4"
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
								setEditMode(postDataByID?.text);
								close();
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
							className="mb-4"
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
							Delete Post
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
							className="mb-4"
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
