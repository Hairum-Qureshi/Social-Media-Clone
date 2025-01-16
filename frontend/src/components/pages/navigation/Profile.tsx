import {
	faArrowLeft,
	faCalendarDays,
	faLock,
	faPencil
} from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Post from "../feed/editor-tools/Post";
import { useRef, useState } from "react";
import UserSettingsModal from "../../UserSettingsModal";

export default function Profile() {
	const [showModal, setShowModal] = useState(false);
	const [isPosts, setIsPosts] = useState(true);
	const [isLikes, setIsLikes] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function closeModal() {
		setShowModal(false);
	}

	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto relative">
			{showModal && <UserSettingsModal closeModal={closeModal} />}
			<div className="w-full p-2 flex items-center">
				<div className="text-xl ml-5">
					<FontAwesomeIcon icon={faArrowLeft} />
				</div>
				<div>
					<h2 className="font-bold ml-5 text-xl">Username</h2>
					<div className="ml-5 text-gray-600">2 posts</div>
				</div>
			</div>
			<div className="w-full h-1/4 relative">
				<img
					src="https://wallpapers.com/images/hd/blue-tree-aesthetic-pc-cqlbvlg42a4d0tob.jpg"
					alt="Background image"
					className="w-full h-full object-cover"
					accept="image/png, image/gif, image/jpeg"
				/>
				<div
					className="absolute top-0 right-0 mr-5 bg-slate-500 rounded-lg p-2 border-2 border-gray-300 w-8 h-8 text-sm flex items-center justify-center opacity-40 hover:opacity-100 hover:cursor-pointer active:opacity-80"
					onClick={() => fileInputRef.current?.click()}
				>
					<FontAwesomeIcon icon={faPencil} />
				</div>
			</div>
			<div className="w-full flex items-center hover:cursor-pointer">
				<img
					src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
					alt="User profile picture"
					accept="image/png, image/gif, image/jpeg"
					className="border-2 border-black rounded-full z-10 w-1/4 h-1/4 object-cover ml-10 lg:-mt-28 -mt-20 hover:opacity-85 active:opacity-80"
					onClick={() => fileInputRef.current?.click()}
				/>
				<input type="file" ref={fileInputRef} className="hidden" />
				<button
					className="ml-auto mr-10 border-2 border-white text-sm rounded-full p-2"
					onClick={() => setShowModal(true)}
				>
					Edit Profile
				</button>
			</div>
			<div className="w-full border-b-2 border-b-gray-700">
				<div className="mt-5">
					<h3 className="font-bold ml-5 text-xl">Username</h3>
					<p className="text-gray-500 text-base ml-5">@username</p>
					<div className="mx-5 my-2">
						<div>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab facere
							soluta autem, repellendus vel quos! Est, praesentium rem! Debitis
							maxime labore fugit consequuntur explicabo enim rem laborum minima
							quibusdam magnam!
						</div>
						<div className="mt-3 text-gray-500">
							<span>
								<FontAwesomeIcon icon={faLocationDot} />
								&nbsp; United States
							</span>
							<span className="ml-5">
								<FontAwesomeIcon icon={faCalendarDays} />
								&nbsp; Joined January 2025
							</span>
						</div>
						<div className="w-full mt-3 flex mb-3">
							<p className="text-gray-500">
								<span className="text-white font-bold">100</span>
								<span className="">&nbsp; Followers</span>
							</p>
							<p className="text-gray-500 ml-3">
								<span className="text-white font-bold">2</span>
								<span className="">&nbsp; Following</span>
							</p>
						</div>
					</div>
					<div className="w-full flex text-center">
						<div
							className={`flex items-center justify-center w-1/2 p-2hover:cursor-pointer hover:bg-gray-900 ${
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
					<>
						<Post text={"Hi"} />
						<Post text={"Another post"} />
						<Post text={"Another post!"} />
					</>
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
