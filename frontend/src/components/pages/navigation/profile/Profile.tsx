import { faLock } from "@fortawesome/free-solid-svg-icons";
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

// TODO - get the number of posts the user has (currently it only works for the current user and not other users)
// TODO - need to get other users' posts too to display on their profile pages
// 		--> change logic over looping over the 'currentUserPosts' so that when you go to a different user's page, it displays their posts, not the current user's
// TODO - add a kebab button to allow users to block profiles too
// TODO - if the user visits a profile of a non-existent user, it should lead to a 404 page
// TODO - need to display some kind of loading indication to show that the profile picture/backdrop is being uploaded
// TODO - make the back button work
// TODO - sometimes when switching from one user profile to the other, it shows your profile first before showing the other user's
// TODO - get rid of the lighter opacity effect when hovering over the pfp picture
// ! FIX: when updating the location in the settings modal, for some reason you still have to refresh the page to see the change
// ! FIX: the kebab buttons are not shifted to the right in mobile view for the posts
export default function Profile() {
	const [showModal, setShowModal] = useState(false);
	const [isPosts, setIsPosts] = useState(true);
	const [isMedia, setIsMedia] = useState(false);
	const [isLikes, setIsLikes] = useState(false);
	const { userData } = useAuthContext()!;
	const { currentUserPostData } = usePosts();
	const { profileData } = useProfile();

	function closeModal() {
		setShowModal(false);
	}

	function openModal() {
		setShowModal(true);
	}

	const { postsImages } = useProfile();

	// TODO - figure out why posts' images aren't being displayed in the media section

	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto relative">
			{showModal && <UserSettingsModal closeModal={closeModal} />}
			<ProfileHeader openModal={openModal} />
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
					currentUserPostData?.length > 0 ? (
						currentUserPostData?.map((post: IPost) => {
							return (
								<Link to={`/post/${post._id}`} key={post._id}>
									<Post isOwner={true} postData={post} />
								</Link>
							);
						})
					) : (
						<FollowersSuggestions />
					)
				) : profileData?._id === userData?._id && isLikes ? (
					<div className="bg-blue-950 rounded-md m-2 text-white p-2 text-sm">
						<p>
							<span className="mx-3">
								<FontAwesomeIcon icon={faLock} />
							</span>
							Your likes are private. Only you can see them.
						</p>
					</div>
				) : (
					<div className="text-white p-2 flex justify-center">
						{postsImages?.length > 0 ? (
							<div className="grid grid-cols-3 gap-3 w-full max-w-4xl m-0">
								{postsImages?.map((postImageData: PostImage) =>
									postImageData.postImages?.map(
										(postImageSrc: string, imageIndex: number) => (
											<Link
												key={`${postImageData._id}-${imageIndex}`}
												to={`/post/${postImageData._id}/image/${
													imageIndex + 1
												}`}
											>
												<img
													src={postImageSrc}
													alt="post media"
													className="w-full aspect-square object-cover rounded"
												/>
											</Link>
										)
									)
								)}
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
