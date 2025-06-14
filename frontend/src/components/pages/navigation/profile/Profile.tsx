import { faClone, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UserSettingsModal from "../../../UserSettingsModal";
import useAuthContext from "../../../../contexts/AuthContext";
import usePosts from "../../../../hooks/usePosts";
import { Link } from "react-router-dom";
import { Post as IPost, PostImage } from "../../../../interfaces";
import Post from "../../feed/editor-tools/Post";
import useProfile from "../../../../hooks/useProfile";
import FollowersSuggestions from "../../feed/suggestions/FollowersSuggestions";
import ProfileHeader from "./ProfileHeader";
import { checkIfAnyPostImagesExist } from "../../../../utils/checkIfAnyPostImagesExist";

// TODO - add a kebab button to allow users to block profiles too
// TODO - if the user visits a profile of a non-existent user, it should lead to a 404 page
// TODO - need to display some kind of loading indication to show that the profile picture/backdrop is being uploaded
// TODO - add a character limit to the textarea for the bio
// TODO - get rid of the lighter opacity effect when hovering over the pfp picture
// ! FIX: when updating the location in the settings modal, for some reason you still have to refresh the page to see the change
// ! FIX: the kebab buttons are not shifted to the right in mobile view for the posts
export default function Profile() {
	const [showModal, setShowModal] = useState(false);
	const [isPosts, setIsPosts] = useState(true);
	const [isMedia, setIsMedia] = useState(false);
	const [isLikes, setIsLikes] = useState(false);
	const { userData } = useAuthContext()!;
	const { currentProfilePostData, currUserLikedPosts } = usePosts();
	const { profileData, postsImages } = useProfile();

	function closeModal() {
		setShowModal(false);
	}

	function openModal() {
		setShowModal(true);
	}

	const sortedPosts: IPost[] = (
		currentProfilePostData
			? [...currentProfilePostData]?.sort((a, b) => {
					if (a.isPinned === b.isPinned) return 0;
					return a.isPinned ? -1 : 1; // Pinned posts first
			  })
			: profileData
	) as IPost[];

	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto relative">
			{showModal && <UserSettingsModal closeModal={closeModal} />}
			<ProfileHeader openModal={openModal} isMedia={isMedia} />
			<div className="w-full flex text-center">
				<div
					className={`flex items-center justify-center w-1/2 p-2 hover:cursor-pointer hover:bg-gray-900 ${
						isPosts && "border-b-2 border-sky-500"
					}`}
					onClick={() => {
						setIsLikes(false);
						setIsPosts(true);
						setIsMedia(false);
					}}
				>
					Posts
				</div>
				{profileData?._id === userData?._id && (
					<div
						className={`flex items-center justify-center w-1/2 p-2 hover:cursor-pointer hover:bg-gray-900 ${
							isLikes && "border-b-2 border-sky-500"
						}`}
						onClick={() => {
							setIsLikes(true);
							setIsPosts(false);
							setIsMedia(false);
						}}
					>
						Likes
					</div>
				)}
				<div
					className={`flex items-center justify-center w-1/2 p-2 hover:cursor-pointer hover:bg-gray-900 ${
						isMedia && "border-b-2 border-sky-500"
					}`}
					onClick={() => {
						setIsLikes(false);
						setIsPosts(false);
						setIsMedia(true);
					}}
				>
					Media
				</div>
			</div>
			<div>
				{isPosts ? (
					sortedPosts?.length > 0 ? (
						sortedPosts?.map((post: IPost) => {
							return (
								<div>
									<Link to={`/post/${post._id}`} key={post._id}>
										<Post
											isOwner={true}
											postData={post}
											isPinned={post.isPinned}
										/>
									</Link>
								</div>
							);
						})
					) : (
						<FollowersSuggestions />
					)
				) : profileData?._id === userData?._id && isLikes ? (
					<>
						<div className="bg-blue-950 rounded-md m-2 text-white p-2 text-sm">
							<p>
								<span className="mx-3">
									<FontAwesomeIcon icon={faLock} />
								</span>
								Your likes are private. Only you can see them.
							</p>
						</div>
						<div>
							{currUserLikedPosts?.length > 0 ? (
								currUserLikedPosts.map((post: IPost) => {
									return (
										<Post
											isOwner={userData?._id === post.user._id}
											postData={post}
											showTopBorder={false}
										></Post>
									);
								})
							) : (
								<h1 className="text-center text-white font-semibold text-xl mt-10">
									You haven't liked any Tweets yet
								</h1>
							)}
						</div>
					</>
				) : (
					<div className="text-white p-2 flex justify-center">
						{checkIfAnyPostImagesExist(postsImages) ? (
							<div className="grid grid-cols-3 gap-3 w-full max-w-4xl m-0 absolute">
								{postsImages?.map((postImageData: PostImage) => {
									const isMultiImage = postImageData.postImages.length > 1;
									const firstImageSrc = postImageData.postImages[0];
									if (firstImageSrc)
										return (
											<Link
												key={postImageData._id}
												to={`/${profileData?.username}/post/${postImageData._id}/photo/1`}
											>
												<div className="relative">
													<img
														src={firstImageSrc}
														alt="post media"
														className="w-full aspect-square object-cover rounded"
													/>
													{isMultiImage && (
														<div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded">
															<FontAwesomeIcon icon={faClone} />
														</div>
													)}
												</div>
											</Link>
										);
								})}
							</div>
						) : (
							<div>
								<h3 className="font-bold mt-10 text-5xl">
									Lights, camera ... <br /> attachments!
								</h3>
								<p className="text-zinc-500 mt-3">
									When you post photos or videos, they will show up here.
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
