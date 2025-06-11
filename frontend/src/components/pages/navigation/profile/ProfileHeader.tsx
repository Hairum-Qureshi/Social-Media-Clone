import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../../../../contexts/AuthContext";
import useProfile from "../../../../hooks/useProfile";
import {
	faArrowLeft,
	faCalendarDays,
	faCertificate,
	faLocationDot,
	faPencil
} from "@fortawesome/free-solid-svg-icons";
import usePosts from "../../../../hooks/usePosts";
import { useRef } from "react";
import isFollowing from "../../../../utils/checkFollowingStatus";
import getMonthAndYear from "../../../../utils/getMonthAndYear";
import { PostImage, ProfileHeaderProps } from "../../../../interfaces";
import DOMPurify from "dompurify";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ProfileHeader({
	openModal,
	isMedia
}: ProfileHeaderProps) {
	const { userData } = useAuthContext()!;
	const { profileData, handleFollowing, handleImage } = useProfile();
	const { currentProfilePostData } = usePosts();
	const filePFPInputRef = useRef<HTMLInputElement>(null);
	const fileBackgroundImageInputRef = useRef<HTMLInputElement>(null);
	const rawBio =
		userData?._id !== profileData?._id ? profileData?.bio : userData?.bio;
	const collapsedBio = rawBio ? rawBio.replace(/\n{2,}/g, "\n") : "";
	const formattedBio = collapsedBio.replace(/\n/g, "<br/>");
	const sanitizedBio = DOMPurify.sanitize(formattedBio);
	const location = useLocation();
	const profileUsername = location.pathname.split("/").pop();
	const { postsImages } = useProfile();

	const numImages: string[] = postsImages?.flatMap(
		(postImage: PostImage) => postImage.postImages
	);

	const navigate = useNavigate();

	return (
		<>
			<div className="w-full p-2 flex items-center sticky top-0 bg-black bg-opacity-80 z-50">
				<div
					className="text-xl ml-5 hover:cursor-pointer"
					onClick={() => navigate(-1)}
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</div>
				<div>
					<h2 className="font-bold ml-5 text-xl">
						{userData?._id !== profileData?._id
							? profileData?.username
							: userData?.username}
					</h2>
					<div className="ml-5 text-gray-600">
						{isMedia
							? `${numImages?.length} photos and/or videos`
							: `${currentProfilePostData?.length || 0} post${
									currentProfilePostData?.length === 1 ? "" : "s"
							  }`}
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
						onClick={() => openModal()}
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
							<div dangerouslySetInnerHTML={{ __html: sanitizedBio }} />
							{userData?.extendedBio && (
								<Link to={`/${userData?.username}/bio`}>
									<p className="text-sky-500 underline">View More</p>
								</Link>
							)}
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
							<Link
								to={`/${profileUsername}/followers`}
								className="hover:underline"
							>
								<p className="text-gray-500">
									<span className="text-white font-bold">
										{profileData?.numFollowers}
									</span>
									<span>&nbsp; Followers</span>
								</p>
							</Link>
							<Link
								to={`/${profileUsername}/following`}
								className="hover:underline"
							>
								<p className="text-gray-500 ml-3">
									<span className="text-white font-bold">
										{profileData?.numFollowing}
									</span>
									<span>&nbsp; Following</span>
								</p>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
