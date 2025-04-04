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
import { Post as IPost } from "../../../interfaces";
import Post from "../feed/editor-tools/Post";

// ! FIX: the kebab buttons are not shifted to the right in mobile view for the posts
export default function Profile() {
	const [showModal, setShowModal] = useState(false);
	const [isPosts, setIsPosts] = useState(true);
	const [isLikes, setIsLikes] = useState(false);
	const filePFPInputRef = useRef<HTMLInputElement>(null);
	const fileBackgroundImageInputRef = useRef<HTMLInputElement>(null);
	const { userData } = useAuthContext()!;
	const { currentUserPostData } = usePosts();
	// const [pfpBlob, setPfpBlob] = useState("");
	// const [backgroundBlob, setBackgroundBlob] = useState("");

	function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
		const files: FileList | null = event.target.files;
		if (files && files.length > 0) {
			const blobUrl = window.URL.createObjectURL(files[0]);
			// setUploadedImages(prev => [...prev, blobUrl]);
			console.log("Image uploaded:", blobUrl);
		}
	}

	function closeModal() {
		setShowModal(false);
	}

	function getMonthAndYear(isoString: Date | undefined) {
		if (isoString) {
			const date = new Date(isoString);
			const year = date.getFullYear();
			const month = date.toLocaleString("default", { month: "long" });
			return { month, year };
		}
	}

	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto relative">
			{showModal && <UserSettingsModal closeModal={closeModal} />}
			<div className="w-full p-2 flex items-center">
				<div className="text-xl ml-5">
					<FontAwesomeIcon icon={faArrowLeft} />
				</div>
				<div>
					<h2 className="font-bold ml-5 text-xl">{userData?.username}</h2>
					<div className="ml-5 text-gray-600">0 posts</div>
				</div>
			</div>
			<div className="w-full h-1/4 relative">
				<img
					src={userData?.coverImage}
					alt="Background image"
					className="w-full h-full object-cover"
				/>
				<input
					type="file"
					onChange={event => handleImage(event)}
					className="hidden"
					ref={fileBackgroundImageInputRef}
					accept="image/*"
				/>
				<div
					className="absolute top-0 right-0 mr-5 bg-slate-500 rounded-lg p-2 border-2 border-gray-300 w-8 h-8 text-sm flex items-center justify-center opacity-40 hover:opacity-100 hover:cursor-pointer active:opacity-80"
					onClick={() => fileBackgroundImageInputRef.current?.click()}
				>
					<FontAwesomeIcon icon={faPencil} />
				</div>
			</div>
			<div className="w-full flex items-center hover:cursor-pointer">
				<img
					src={userData?.profilePicture}
					alt="User profile picture"
					className="border-2 border-black rounded-full z-10 w-1/4 h-1/4 object-cover ml-10 lg:-mt-28 -mt-20 hover:opacity-85 active:opacity-80"
					onClick={() => filePFPInputRef.current?.click()}
				/>
				<input
					type="file"
					onChange={event => handleImage(event)}
					className="hidden"
					accept="image/*"
					ref={filePFPInputRef}
				/>
				<button
					className="ml-auto mr-10 border-2 border-white text-sm rounded-full p-2"
					onClick={() => setShowModal(true)}
				>
					Edit Profile
				</button>
			</div>

			<div className="w-full border-b-2 border-b-gray-700">
				<div className="mt-5">
					<h3 className="font-bold ml-5 text-xl">
						{userData?.fullName}{" "}
						{userData?.isVerified && (
							<span className="text-purple-500" title="This is a verified account">
								<FontAwesomeIcon icon={faCertificate} />
							</span>
						)}
					</h3>
					<p className="text-gray-500 text-base ml-5">@{userData?.username}</p>
					<div className="mx-5 my-2">
						<div>{userData?.bio}</div>
						<div className="mt-3 text-gray-500">
							<span>
								<FontAwesomeIcon icon={faLocationDot} />
								&nbsp; {userData?.location || "N/A"}
							</span>
							<span className="ml-5">
								<FontAwesomeIcon icon={faCalendarDays} />
								&nbsp; Joined{" "}
								{`${getMonthAndYear(userData?.createdAt)?.month} ${
									getMonthAndYear(userData?.createdAt)?.year
								}`}
							</span>
						</div>
						<div className="w-full mt-3 flex mb-3">
							<p className="text-gray-500">
								<span className="text-white font-bold">
									{userData?.numFollowers}
								</span>
								<span className="">&nbsp; Followers</span>
							</p>
							<p className="text-gray-500 ml-3">
								<span className="text-white font-bold">
									{userData?.numFollowing}
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
							}}
						>
							Posts
						</div>
						<div
							className={`flex items-center justify-center w-1/2 p-2 hover:cursor-pointer hover:bg-gray-900 ${
								isLikes && "border-b-2 border-sky-500"
							}`}
							onClick={() => {
								setIsLikes(true);
								setIsPosts(false);
							}}
						>
							Likes
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
						<p className="text-slate-400 text-center mt-10 font-semibold">
							Make your first post!
						</p>
					)
				) : (
					<div className="bg-blue-950 rounded-md m-2 text-white p-2 text-sm">
						<p>
							<span className="mx-3">
								<FontAwesomeIcon icon={faLock} />
							</span>
							Your likes are private. Only you can see them.
						</p>
					</div>
				)}
				{/* Show the follower suggestions IF the user hasn't posted anything */}
				{/* <FollowersSuggestions /> */}
			</div>
		</div>
	);
}
