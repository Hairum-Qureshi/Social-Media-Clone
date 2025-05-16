import {
	faArrowLeft,
	faCalendarDays,
	faCertificate,
	faLock,
	faPencil
} from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import UserSettingsModal from "../../UserSettingsModal";
import useAuthContext from "../../../contexts/AuthContext";
import usePosts from "../../../hooks/usePosts";
import { Link } from "react-router-dom";
import { Post as IPost, PostImage } from "../../../interfaces";
import Post from "../feed/editor-tools/Post";
import useProfile from "../../../hooks/useProfile";
import isFollowing from "../../../utils/checkFollowingStatus";
import getMonthAndYear from "../../../utils/getMonthAndYear";
import FollowersSuggestions from "../feed/suggestions/FollowersSuggestions";

// TODO - get the number of posts the user has (currently it only works for the current user and not other users)
// TODO - need to get other users' posts too to display on their profile pages
// TODO - add a kebab button to allow users to block profiles too
// TODO - if the user visits a profile of a non-existent user, it should lead to a 404 page
// TODO - need to display some kind of loading indication to show that the profile picture/backdrop is being uploaded
// TODO - make the back button work
// TODO - sometimes when switching from one user profile to the other, it shows your profile first before showing the other user's
// TODO - get rid of the lighter opacity effect when hovering over the pfp picture
// TODO - change logic over looping over the 'currentUserPosts' so that when you go to a different user's page, it displays their posts, not the current user's
// TODO - add a tab for all post attachments
// ! FIX: when updating the location in the settings modal, for some reason you still have to refresh the page to see the change
// ! FIX: the kebab buttons are not shifted to the right in mobile view for the posts
export default function Profile() {
	const [showModal, setShowModal] = useState(false);
	const [isPosts, setIsPosts] = useState(true);
	const [isMedia, setIsMedia] = useState(false);
	const [isLikes, setIsLikes] = useState(false);
	const filePFPInputRef = useRef<HTMLInputElement>(null);
	const fileBackgroundImageInputRef = useRef<HTMLInputElement>(null);
	const { userData } = useAuthContext()!;
	const { currentUserPostData } = usePosts();
	const { profileData, handleFollowing } = useProfile();

	function closeModal() {
		setShowModal(false);
	}

	const { handleImage, postsImages } = useProfile();

	// TODO - figure out why posts' images aren't being displayed in the media section

	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto relative">
			{showModal && <UserSettingsModal closeModal={closeModal} />}
			<div className="w-full p-2 flex items-center">
				<div className="text-xl ml-5">
					<FontAwesomeIcon icon={faArrowLeft} />
				</div>
				<div>
					<h2 className="font-bold ml-5 text-xl">
						{userData?._id !== profileData?._id
							? profileData?.username
							: userData?.username}
					</h2>
					<div className="ml-5 text-gray-600">
						{currentUserPostData?.length || 0} post
						{currentUserPostData?.length === 1 ? "" : "s"}
					</div>
				</div>
			</div>
			<div className="w-full h-1/4 relative">
				<img
					src={profileData?.coverImage}
					alt="Background image"
					className="w-full h-full object-cover"
				/>
				{profileData?._id === userData?._id && (
					<input
						type="file"
						onChange={event => handleImage(event, false)}
						className="hidden"
						ref={fileBackgroundImageInputRef}
						accept="image/*"
					/>
				)}
				{profileData?._id === userData?._id && (
					<div
						className={`absolute top-0 right-0 bg-slate-500 rounded-lg p-2 border-2 border-gray-300 w-8 h-8 text-sm flex items-center justify-center m-3 ${
							profileData?._id === userData?._id
								? "opacity-40 hover:opacity-100 hover:cursor-pointer active:opacity-80"
								: ""
						}`}
						onClick={() => fileBackgroundImageInputRef.current?.click()}
					>
						<FontAwesomeIcon icon={faPencil} />
					</div>
				)}
			</div>
			<div className="w-full flex items-center hover:cursor-pointer">
				<img
					src={profileData?.profilePicture}
					alt="User profile picture"
					className={`border-2 border-black rounded-full z-10 object-cover w-40 h-40 ml-10 lg:-mt-28 -mt-20 ${
						profileData?._id === userData?._id
							? "hover:opacity-85 active:opacity-80"
							: ""
					}`}
					onClick={() => filePFPInputRef.current?.click()}
				/>

				{profileData?._id === userData?._id && (
					<input
						type="file"
						onChange={event => handleImage(event, true)}
						className="hidden"
						accept="image/*"
						ref={filePFPInputRef}
					/>
				)}

				{profileData?._id === userData?._id ? (
					<button
						className="ml-auto mr-10 mt-5 border-2 border-white text-sm rounded-full p-2"
						onClick={() => setShowModal(true)}
					>
						Edit Profile
					</button>
				) : (
					<>
						{isFollowing(profileData, userData?._id) ? (
							<button
								className="ml-auto mr-10 border-2 hover:border-red-900 hover:text-red-600 font-semibold w-25 text-base rounded-full p-2"
								onClick={() => handleFollowing(profileData?._id)}
							>
								Unfollow
							</button>
						) : (
							<button
								className="ml-auto mr-10 border-2 bg-white text-black font-semibold w-20 text-base rounded-full p-2"
								onClick={() => handleFollowing(profileData?._id)}
							>
								Follow
							</button>
						)}
					</>
				)}
			</div>
			<div className="w-full border-b-2 border-b-gray-700">
				<div className="mt-1">
					<h3 className="font-bold ml-5 text-xl">
						{userData?._id !== profileData?._id
							? profileData?.fullName
							: userData?.fullName}
						{profileData?.isVerified && (
							<span
								className="text-purple-500"
								title="This is a verified account"
							>
								<FontAwesomeIcon icon={faCertificate} />
							</span>
						)}
					</h3>
					<p className="text-gray-500 text-base ml-5">
						@
						{userData?._id !== profileData?._id
							? profileData?.username
							: userData?.username}
					</p>
					<div className="mx-5 my-2">
						<div>
							{userData?._id !== profileData?._id
								? profileData?.bio
								: userData?.bio}
						</div>
						<div className="mt-3 text-gray-500">
							<span>
								<FontAwesomeIcon icon={faLocationDot} />
								&nbsp; {profileData?.location || "N/A"}
							</span>
							<span className="ml-5">
								<FontAwesomeIcon icon={faCalendarDays} />
								&nbsp; Joined{" "}
								{`${getMonthAndYear(profileData?.createdAt)?.month} ${
									getMonthAndYear(profileData?.createdAt)?.year
								}`}
							</span>
						</div>
						<div className="w-full mt-3 flex mb-3">
							<p className="text-gray-500">
								<span className="text-white font-bold">
									{profileData?.numFollowers}
								</span>
								<span className="">&nbsp; Followers</span>
							</p>
							<p className="text-gray-500 ml-3">
								<span className="text-white font-bold">
									{profileData?.numFollowing}
								</span>
								<span className="">&nbsp; Following</span>
							</p>
						</div>
					</div>
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
								{postsImages.flatMap((postImageData: PostImage) =>
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
