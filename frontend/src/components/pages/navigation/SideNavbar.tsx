import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TwitterXSVG from "../../../assets/twitter-x.svg";
import {
	faBell,
	faBookmark,
	faHouse,
	faMagnifyingGlass,
	faMessage,
	faRightFromBracket,
	faUser
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAuthContext from "../../../contexts/AuthContext";
import { useState } from "react";
import PostModal from "../../post/PostModal";
import Editor from "../feed/editor-tools/Editor";

export default function SideNavbar() {
	const { signOut } = useAuth();
	const { userData } = useAuthContext()!;
	const [showPostModal, setShowPostModal] = useState(false);
	const isFeed: boolean = window.location.pathname === "/";
	// TODO - need to replace hardcoded '/username' param for profile route with the authenticated user's username
	// TODO - need to make the icons centered
	return (
		<>
			{showPostModal && !isFeed ? (
				<PostModal>
					<Editor showBorder={false} />
				</PostModal>
			) : null}
			<div className="bg-black border-r-2 border-r-gray-700 text-white h-screen lg:w-1/4 w-20 overflow-hidden flex">
				<div className="h-ful w-full lg:relative items-center justify-center">
					<Link to="/">
						<img
							src={TwitterXSVG}
							alt="Twitter-X SVG"
							className="w-10 h-10 mt-3"
						/>
					</Link>
					<div className="text-2xl p-2">
						<Link to="/">
							<div className="ml-3">
								<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
									<span>
										<FontAwesomeIcon icon={faHouse} />
									</span>
									<span className="ml-5 hidden lg:inline-block">Home</span>
								</div>
							</div>
						</Link>
						<Link to="/explore">
							<div className="ml-3">
								<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
									<span>
										<FontAwesomeIcon icon={faMagnifyingGlass} />
									</span>
									<span className="ml-5 hidden lg:inline-block">Explore</span>
								</div>
							</div>
						</Link>
						<Link to="/notifications">
							<div className="ml-3">
								<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
									<span>
										<FontAwesomeIcon icon={faBell} />
									</span>
									<span className="ml-5 hidden lg:inline-block">
										Notifications
									</span>
								</div>
							</div>
						</Link>
						<Link to="/messages">
							<div className="ml-3">
								<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
									<span>
										<FontAwesomeIcon icon={faMessage} />
									</span>
									<span className="ml-5 hidden lg:inline-block">Messages</span>
								</div>
							</div>
						</Link>
						<Link to="/bookmarks">
							<div className="ml-3">
								<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
									<span>
										<FontAwesomeIcon icon={faBookmark} />
									</span>
									<span className="ml-5 hidden lg:inline-block">Bookmarks</span>
								</div>
							</div>
						</Link>
						<Link to={`/${userData?.username}`}>
							<div className="ml-3">
								<div className="my-6 -ml-4 hover:bg-gray-800 p-2 rounded-full">
									<span>
										<FontAwesomeIcon icon={faUser} />
									</span>
									<span className="ml-5 hidden lg:inline-block">Profile</span>
								</div>
							</div>
						</Link>
					</div>
					<div className="lg:absolute lg:bottom-0 lg:left-0 lg:w-full flex flex-col items-center justify-center text-center">
						<div className="w-full rounded-full p-2 text-lg text-black font-bold text-center">
							<div
								className="bg-white p-2 lg:rounded-md hover:cursor-pointer lg:mr-4"
								onClick={() => setShowPostModal(true)}
							>
								POST
							</div>
						</div>
						<div className="w-full lg:rounded-md text-base font-bold text-center my-8 break-all">
							<div className="hover:bg-gray-800 p-2 rounded-md lg:mx-2 hover:cursor-pointer">
								<div className="flex items-center">
									<img
										src={userData?.profilePicture}
										alt="User pfp"
										className="lg:w-10 lg:h-10 w-12 h-12 rounded-full"
									/>
									<Link to={`/${userData?.username}`} className="w-full">
										<div className="hidden lg:flex lg:flex-col lg:w-full lg:text-left">
											<span
												className="text-lg font-bold flex justify-between items-center ml-3"
												onClick={signOut}
											>
												{userData?.fullName}
												<Link to="/sign-in">
													<FontAwesomeIcon
														icon={faRightFromBracket}
														className="ml-auto"
													/>
												</Link>
											</span>
											<span className="text-sm text-gray-400 font-light ml-3">
												@{userData?.username}
											</span>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
